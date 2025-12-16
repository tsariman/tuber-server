## `202512152026` feat: Implement email verification process for new users

- Added email verification code generation and expiration handling during user registration.
- Created a new endpoint `/users/email/verify` to handle email verification requests.
- Updated user schema to include fields for email verification code and expiration.
- Enhanced user creation logic to send verification emails asynchronously.
- Introduced rate limiting for user signup and signin attempts.
- Updated authentication flow to include last signin timestamp updates.
- Refactored user-related functions and improved JWT version handling to invalidate old tokens.
- Added tests for email verification process and JWT version invalidation.

## `202512121503` Refactor error handling and access control in bookmark routes

- Updated `JsonapiErrorBuilder` to streamline error response creation.
- Changed `DatabaseError` code from 'DB_ERROR' to 'DATABASE_ERROR'.
- Enhanced `Access` class to include methods for checking user permissions on resources.
- Updated access control checks in bookmark-related endpoints to use new permission methods.
- Refactored bookmark retrieval and modification logic to ensure proper error handling and user permissions.
- Added platform-specific validation for bookmark data in POST and PATCH endpoints.
- Introduced `RequestDataValidator` tests to ensure validation logic for matching fields.
- Adjusted comments and documentation for clarity and consistency.

## Security question for AI

- What are the common pitfalls, edge-cases, and exploits when a user account is created?