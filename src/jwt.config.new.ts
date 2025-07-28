import { FastifyInstance } from 'fastify';
import { JWTKeyManager } from './business.logic/security/jwt.key.manager';
import { JWTHealthMonitor } from './business.logic/security/jwt.health.monitor';
import fastifyJwt from '@fastify/jwt';
import Config from './config';

/**
 * Production-ready JWT configuration with key rotation support
 */
export async function setupProductionJWT(server: FastifyInstance): Promise<void> {
  const keyManager = JWTKeyManager.getInstance();
  const healthMonitor = JWTHealthMonitor.getInstance();
  
  // Register JWT with the current signing key
  await server.register(fastifyJwt, {
    secret: keyManager.getCurrentSigningKey(),
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });

  // Custom verification method that tries multiple keys
  server.decorate('jwtVerifyWithRotation', async function(token: string) {
    const verificationKeys = keyManager.getVerificationKeys();
    
    for (const key of verificationKeys) {
      try {
        // Create a new JWT instance with the specific key
        const tempJwt = require('@fastify/jwt');
        const verifier = tempJwt.createVerifier({ key });
        const decoded = verifier(token);
        return decoded;
      } catch (error) {
        // Continue to next key if verification fails
        continue;
      }
    }
    
    // If no key worked, throw the last error
    throw new Error('Token verification failed with all available keys');
  });

  // Add comprehensive JWT monitoring endpoints
  server.get('/admin/jwt/status', async (_request, reply) => {
    const status = keyManager.getRotationStatus();
    const health = healthMonitor.getHealthStatus();
    
    reply.send({
      status: 'ok',
      jwt_rotation: status,
      health_status: health,
      environment: process.env.NODE_ENV,
      total_keys_available: keyManager.getTotalKeysCount()
    });
  });

  server.get('/admin/jwt/health', async (_request, reply) => {
    const health = healthMonitor.getHealthStatus();
    const metrics = healthMonitor.getMetrics();
    const testResult = await healthMonitor.testKeyVerification();
    
    reply.send({
      health,
      metrics,
      verification_test: testResult,
      timestamp: new Date().toISOString()
    });
  });

  server.get('/admin/jwt/metrics', async (_request, reply) => {
    const metrics = healthMonitor.getMetrics();
    reply.send(metrics);
  });

  // Add manual key rotation endpoint for emergency situations
  server.post('/admin/jwt/rotate', async (_request, reply) => {
    const oldStatus = keyManager.getRotationStatus();
    keyManager.rotateKey();
    const newStatus = keyManager.getRotationStatus();
    
    Config.log('[JWT] Manual key rotation triggered');
    
    reply.send({
      status: 'rotated',
      old_key_index: oldStatus.currentKeyIndex,
      new_key_index: newStatus.currentKeyIndex,
      rotation_time: new Date().toISOString(),
      next_rotation: new Date(newStatus.nextRotationTime).toISOString()
    });
  });

  Config.log('[JWT] Production JWT setup completed with key rotation support');
}

/**
 * Fallback configuration for development (simpler setup)
 */
export async function setupDevelopmentJWT(server: FastifyInstance): Promise<void> {
  const keyManager = JWTKeyManager.getInstance();
  
  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || keyManager.getCurrentSigningKey(),
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });

  Config.log('[JWT] Development JWT setup completed');
}

/**
 * Main JWT setup function that chooses the appropriate configuration
 */
export async function setupJWT(server: FastifyInstance): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    await setupProductionJWT(server);
  } else {
    await setupDevelopmentJWT(server);
  }
}
