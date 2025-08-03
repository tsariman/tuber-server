import { JWTKeyManager } from './jwt.key.manager';
import { log, ler } from '../../utility/logging';

/**
 * JWT Health Monitor - Monitors key rotation health and performance
 */
export class JWTHealthMonitor {
  private static instance: JWTHealthMonitor;
  private keyManager: JWTKeyManager;
  private healthChecks: Array<{
    timestamp: number;
    keyIndex: number;
    rotationAge: number;
    status: 'healthy' | 'warning' | 'error';
    message?: string;
  }> = [];

  private constructor() {
    this.keyManager = JWTKeyManager.getInstance();
    this.startHealthChecks();
  }

  public static getInstance(): JWTHealthMonitor {
    if (!JWTHealthMonitor.instance) {
      JWTHealthMonitor.instance = new JWTHealthMonitor();
    }
    return JWTHealthMonitor.instance;
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    // Check every hour
    setInterval(() => {
      this.performHealthCheck();
    }, 60 * 60 * 1000);

    // Initial check
    this.performHealthCheck();
  }

  /**
   * Perform a health check on JWT key rotation
   */
  private performHealthCheck(): void {
    const status = this.keyManager.getRotationStatus();
    const now = Date.now();
    
    let healthStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    let message = 'JWT key rotation is functioning normally';

    // Check if rotation is overdue (25 hours = 1 hour grace period)
    const rotationOverdueThreshold = 25 * 60 * 60 * 1000; // 25 hours
    if (status.timeSinceLastRotation > rotationOverdueThreshold) {
      healthStatus = 'error';
      message = `Key rotation is overdue by ${Math.round(
        (status.timeSinceLastRotation - 24 * 60 * 60 * 1000) / (60 * 60 * 1000)
      )} hours`;
    }
    // Check if rotation is approaching (23 hours)
    else if (status.timeSinceLastRotation > 23 * 60 * 60 * 1000) {
      healthStatus = 'warning';
      message = 'Key rotation due within 1 hour';
    }

    const healthCheck = {
      timestamp: now,
      keyIndex: status.currentKeyIndex,
      rotationAge: status.timeSinceLastRotation,
      status: healthStatus,
      message
    };

    this.healthChecks.push(healthCheck);

    // Keep only last 24 health checks
    if (this.healthChecks.length > 24) {
      this.healthChecks = this.healthChecks.slice(-24);
    }

    // Log health status
    if (healthStatus === 'error') {
      ler(`[JWT Health] ${message}`);
    } else if (healthStatus === 'warning') {
      log(`[JWT Health] ${message}`);
    }
  }

  /**
   * Get current health status
   */
  public getHealthStatus(): {
    overall: 'healthy' | 'warning' | 'error';
    currentRotation: Record<string, number>;
    recentChecks: Array<unknown>;
    recommendations: string[];
  } {
    const currentStatus = this.keyManager.getRotationStatus();
    const latestCheck = this.healthChecks[this.healthChecks.length - 1];
    
    const recommendations: string[] = [];
    
    if (latestCheck?.status === 'error') {
      recommendations.push('Consider manual key rotation');
      recommendations.push('Check server restart schedules');
      recommendations.push('Verify key rotation configuration');
    } else if (latestCheck?.status === 'warning') {
      recommendations.push('Monitor for automatic rotation');
      recommendations.push('Prepare for manual rotation if needed');
    }

    // Add general recommendations
    recommendations.push('Monitor JWT verification error rates');
    recommendations.push('Ensure load balancer supports multiple active keys');
    recommendations.push('Backup rotation keys securely');

    return {
      overall: latestCheck?.status || 'healthy',
      currentRotation: currentStatus,
      recentChecks: this.healthChecks.slice(-10), // Last 10 checks
      recommendations
    };
  }

  /**
   * Test key verification capability
   */
  public async testKeyVerification(): Promise<{
    success: boolean;
    testedKeys: number;
    errors: string[];
  }> {
    const verificationKeys = this.keyManager.getVerificationKeys();
    const errors: string[] = [];
    let successCount = 0;

    // Test each verification key
    for (let i = 0; i < verificationKeys.length; i++) {
      try {
        // Simple test - create and verify a test token
        const testPayload = { test: true, timestamp: Date.now() };
        const jwt = require('jsonwebtoken');
        
        const token = jwt.sign(testPayload, verificationKeys[i], {
          algorithm: 'HS256',
          expiresIn: '1m'
        });

        const decoded = jwt.verify(token, verificationKeys[i], {
          algorithms: ['HS256']
        });

        if (decoded) {
          successCount++;
        }
      } catch (error) {
        errors.push(`Key ${i}: ${(error as Error).message}`);
      }
    }

    return {
      success: successCount === verificationKeys.length,
      testedKeys: verificationKeys.length,
      errors
    };
  }

  /**
   * Get metrics for monitoring/alerting systems
   */
  public getMetrics(): {
    jwt_current_key_index: number;
    jwt_time_since_last_rotation_hours: number;
    jwt_time_until_next_rotation_hours: number;
    jwt_active_verification_keys: number;
    jwt_health_status: 0 | 1 | 2; // 0=healthy, 1=warning, 2=error
    jwt_total_available_keys: number;
  } {
    const status = this.keyManager.getRotationStatus();
    const latestCheck = this.healthChecks[this.healthChecks.length - 1];
    
    const healthStatusCode = 
      latestCheck?.status === 'error' ? 2 :
      latestCheck?.status === 'warning' ? 1 : 0;

    return {
      jwt_current_key_index: status.currentKeyIndex,
      jwt_time_since_last_rotation_hours: status.timeSinceLastRotation / (60 * 60 * 1000),
      jwt_time_until_next_rotation_hours: status.timeUntilNextRotation / (60 * 60 * 1000),
      jwt_active_verification_keys: status.activeVerificationKeys,
      jwt_health_status: healthStatusCode,
      jwt_total_available_keys: this.keyManager.getTotalKeysCount()
    };
  }
}

export default JWTHealthMonitor;
