import { model } from 'mongoose';
import crypto from 'crypto';
import blacklistedTokenSchema, {
  IBlacklistedToken,
  IBlacklistedTokenDocument
} from '../../schema/blacklisted.token';

export const BlacklistedTokenModel = model<IBlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);

/**
 * Check if a token is blacklisted
 * @param token The JWT token to check
 * @returns true if the token is blacklisted, false otherwise
 */
export const is_token_blacklisted = async function (token: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const blacklistedToken = await BlacklistedTokenModel.findOne({
    $or: [
      { token_hash: hash },
      { token } // fallback for legacy entries without token_hash
    ]
  });
  return !!blacklistedToken;
};

/**
 * Add a token to the blacklist
 * @param token The JWT token to blacklist
 * @param expiresAt When the original token expires
 * @param reason Optional reason for blacklisting
 * @returns The created blacklisted token document
 */
export const blacklist_token = async function (
  token: string,
  expiresAt: Date,
  reason: string = 'signout'
): Promise<IBlacklistedTokenDocument> {
  const token_hash = crypto.createHash('sha256').update(token).digest('hex');
  const blacklistedToken = await BlacklistedTokenModel.create({
    token,
    token_hash,
    expires_at: expiresAt,
    reason
  });
  return blacklistedToken;
};

/**
 * Remove expired blacklisted tokens (cleanup function)
 * This is handled automatically by the TTL index, but can be called manually if needed
 */
export const cleanup_expired_blacklisted_tokens = async function (): Promise<void> {
  await BlacklistedTokenModel.deleteMany({
    expires_at: { $lt: new Date() }
  });
};