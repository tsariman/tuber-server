
# Development Log

## `202512221825` Miscellaneous improvements and fixes

- feat(security): add clearance levels for user roles
- feat(bookmarks): update bookmark search query to include inception clearance check
- fix(bookmarks): improve error handling and validation for bookmark ID parameters
- refactor(bookmarks): rename user-vote relationships to bookmark-vote for consistency
- fix(authentication): include password in user retrieval for authentication
- fix(twitch): enhance error handling for Twitch thumbnail fetching
- fix(state): improve error handling and validation for state pages endpoint
- chore(logging): enhance logging messages for better debugging
- test(bookmarks): update tests to reflect changes in bookmark-vote relationships

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