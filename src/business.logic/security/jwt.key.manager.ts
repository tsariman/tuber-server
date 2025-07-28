import ROTATION_KEYS from '../../session.secrets';
import Config from '../../config';

/**
 * JWT Key Manager for production-ready key rotation
 * 
 * This manager handles:
 * - Active key rotation based on time intervals
 * - Multiple valid verification keys for seamless rotation
 * - Key health monitoring and rotation strategies
 */
export class JWTKeyManager {
  private static instance: JWTKeyManager;
  private currentKeyIndex = 0;
  private lastRotationTime = Date.now();
  private rotationIntervalMs: number;
  private readonly maxVerificationKeys: number;

  private constructor(
    rotationIntervalMs?: number,
    maxVerificationKeys = 3 // Keep 3 keys valid for verification
  ) {
    // Allow configuration via environment or use default (24 hours)
    const rotationHours = parseInt(process.env.JWT_KEY_ROTATION_INTERVAL_HOURS || '24');
    this.rotationIntervalMs = rotationIntervalMs || (rotationHours * 60 * 60 * 1000);
    this.maxVerificationKeys = maxVerificationKeys;
    this.initializeFromConfig();
  }

  public static getInstance(): JWTKeyManager {
    if (!JWTKeyManager.instance) {
      JWTKeyManager.instance = new JWTKeyManager();
    }
    return JWTKeyManager.instance;
  }

  /**
   * Initialize key manager state from configuration or environment
   */
  private initializeFromConfig(): void {
    const savedIndex = process.env.JWT_CURRENT_KEY_INDEX;
    const savedRotationTime = process.env.JWT_LAST_ROTATION_TIME;

    if (savedIndex && !isNaN(parseInt(savedIndex))) {
      this.currentKeyIndex = parseInt(savedIndex) % ROTATION_KEYS.length;
    }

    if (savedRotationTime && !isNaN(parseInt(savedRotationTime))) {
      this.lastRotationTime = parseInt(savedRotationTime);
    }

    Config.log(`[JWT] Initialized with key index ${this.currentKeyIndex}`);
  }

  /**
   * Get the current signing key
   */
  public getCurrentSigningKey(): string {
    this.rotateKeyIfNeeded();
    return ROTATION_KEYS[this.currentKeyIndex];
  }

  /**
   * Get all valid verification keys (current + previous keys for graceful rotation)
   */
  public getVerificationKeys(): string[] {
    const keys: string[] = [];
    
    for (let i = 0; i < this.maxVerificationKeys; i++) {
      const keyIndex = (this.currentKeyIndex - i + ROTATION_KEYS.length) % ROTATION_KEYS.length;
      keys.push(ROTATION_KEYS[keyIndex]);
    }

    return keys;
  }

  /**
   * Force rotate to the next key
   */
  public rotateKey(): void {
    const oldIndex = this.currentKeyIndex;
    this.currentKeyIndex = (this.currentKeyIndex + 1) % ROTATION_KEYS.length;
    this.lastRotationTime = Date.now();
    
    // Persist the rotation state
    this.persistRotationState();
    
    Config.log(`[JWT] Key rotated from index ${oldIndex} to ${this.currentKeyIndex}`);
  }

  /**
   * Check if key rotation is needed and rotate if necessary
   */
  private rotateKeyIfNeeded(): void {
    const timeSinceLastRotation = Date.now() - this.lastRotationTime;
    
    if (timeSinceLastRotation >= this.rotationIntervalMs) {
      this.rotateKey();
    }
  }

  /**
   * Persist rotation state for recovery after restart
   */
  private persistRotationState(): void {
    process.env.JWT_CURRENT_KEY_INDEX = this.currentKeyIndex.toString();
    process.env.JWT_LAST_ROTATION_TIME = this.lastRotationTime.toString();
    
    // Optional: Save to database for persistence across deployments
    Config.save('JWT_CURRENT_KEY_INDEX', this.currentKeyIndex);
    Config.save('JWT_LAST_ROTATION_TIME', this.lastRotationTime);
  }

  /**
   * Get key rotation status for monitoring
   */
  public getRotationStatus(): {
    currentKeyIndex: number;
    lastRotationTime: number;
    nextRotationTime: number;
    timeSinceLastRotation: number;
    timeUntilNextRotation: number;
    activeVerificationKeys: number;
  } {
    const now = Date.now();
    const timeSinceLastRotation = now - this.lastRotationTime;
    const timeUntilNextRotation = this.rotationIntervalMs - timeSinceLastRotation;

    return {
      currentKeyIndex: this.currentKeyIndex,
      lastRotationTime: this.lastRotationTime,
      nextRotationTime: this.lastRotationTime + this.rotationIntervalMs,
      timeSinceLastRotation,
      timeUntilNextRotation: Math.max(0, timeUntilNextRotation),
      activeVerificationKeys: this.maxVerificationKeys
    };
  }

  /**
   * Get a specific key by index (for testing/admin purposes)
   */
  public getKeyByIndex(index: number): string | null {
    if (index >= 0 && index < ROTATION_KEYS.length) {
      return ROTATION_KEYS[index];
    }
    return null;
  }

  /**
   * Get total number of available keys
   */
  public getTotalKeysCount(): number {
    return ROTATION_KEYS.length;
  }

  /**
   * Set custom rotation interval (for testing or different environments)
   */
  public setRotationInterval(intervalMs: number): void {
    this.rotationIntervalMs = intervalMs;
    Config.log(`[JWT] Rotation interval set to ${intervalMs}ms`);
  }
}

export default JWTKeyManager;
