/**
 * Utility functions for sanitizing sensitive data before logging or display
 */

/**
 * Default list of sensitive field names that should be redacted
 */
const SENSITIVE_FIELDS = new Set([
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'auth',
  'credentials',
  'session',
  'cookie',
  'jwt',
  'bearer',
  'apikey',
  'api_key',
  'access_token',
  'refresh_token',
  'private_key',
  'secret_key',
  'encryption_key'
]);

/**
 * Sanitizes an object by redacting sensitive fields
 * @param obj - The object to sanitize
 * @param customSensitiveFields - Additional field names to redact
 * @param redactValue - The value to replace sensitive data with (default: '[REDACTED]')
 * @returns A sanitized copy of the object
 */
export function sanitize<T extends Record<string, any>>(
  obj: T,
  customSensitiveFields: string[] = [],
  redactValue: string = '[REDACTED]'
): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item, customSensitiveFields, redactValue)) as unknown as T;
  }

  const sanitized: Record<string, any> = {};
  const allSensitiveFields = new Set([...SENSITIVE_FIELDS, ...customSensitiveFields.map(f => f.toLowerCase())]);

  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();

    if (allSensitiveFields.has(lowerKey)) {
      sanitized[key] = redactValue;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value, customSensitiveFields, redactValue);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Sanitizes a request body specifically for authentication-related logging
 * @param body - The request body to sanitize
 * @returns Sanitized body safe for logging
 */
export function sanitizeAuthBody(body: any): any {
  return sanitize(body, ['password', 'token', 'credentials'], '[REDACTED]');
}

/**
 * Creates a sanitized version of an object for logging purposes
 * @param obj - Object to sanitize
 * @param fieldsToKeep - Specific fields to keep (others will be removed)
 * @param sensitiveFields - Fields to redact
 * @returns Object with only specified fields, sensitive data redacted
 */
export function sanitizeForLogging<T extends Record<string, any>>(
  obj: T,
  fieldsToKeep: (keyof T)[] = [],
  sensitiveFields: string[] = []
): Partial<T> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result: Partial<T> = {};
  const allSensitiveFields = new Set([...SENSITIVE_FIELDS, ...sensitiveFields.map(f => f.toLowerCase())]);

  // If fieldsToKeep is specified, only include those fields
  const fieldsToProcess = fieldsToKeep.length > 0 ? fieldsToKeep : Object.keys(obj) as (keyof T)[];

  for (const key of fieldsToProcess) {
    const value = obj[key];
    const lowerKey = String(key).toLowerCase();

    if (allSensitiveFields.has(lowerKey)) {
      result[key] = '[REDACTED]' as any;
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitize(value, sensitiveFields, '[REDACTED]') as any;
    } else {
      result[key] = value;
    }
  }

  return result;
}