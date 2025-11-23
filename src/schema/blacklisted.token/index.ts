import mongoose, { Schema } from 'mongoose';

export interface IBlacklistedToken {
  /** The JWT token that has been blacklisted */
  token: string;
  /** When the token was blacklisted */
  blacklisted_at: Date;
  /** When the original token expires (for cleanup) */
  expires_at: Date;
  /** Reason for blacklisting (optional) */
  reason?: string;
}

export interface IBlacklistedTokenDocument extends mongoose.Document, IBlacklistedToken {};

const blacklistedTokenSchema = new Schema<IBlacklistedTokenDocument>({
  token: { type: String, required: true, unique: true },
  blacklisted_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
  reason: { type: String, default: 'signout' }
});

// TTL index for auto-cleanup of expired tokens
blacklistedTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default blacklistedTokenSchema;