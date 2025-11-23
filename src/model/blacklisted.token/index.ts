import { model } from 'mongoose';
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
  const blacklistedToken = await BlacklistedTokenModel.findOne({ token });
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
  const blacklistedToken = await BlacklistedTokenModel.create({
    token,
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