
# Development Log

## `202602281343` [Feature] Signing with [Enter] key implemented

## `202602061923` [Feature] New state deletion

## `202602031859` [Feature] Implement search scope toggle based on user access

## `202602031857` [Feature] Implement Twitch token renewal scheduling and related functionality

## `202602030941` [Fix] Update match conditions for 'private' and 'all' search modes to handle user IDs as strings and ensure non-authenticated users can only see published bookmarks

## `202601152124` [Refactor] Rename 'mode' to 'themeMode' for consistency across theme handling

## `202601151634` [Feature] Add search mode for bookmark queries and update related endpoints

## `202601151100` Refactor: Update settings, add snackbar test, and improve dialog state types

## `202601051906` Refactor and improve error handling across various modules

- Changed imports from default to type imports in common.types.ts for better clarity.
- Updated config.ts to clarify the purpose of DEFAULT_THEME_MODE.
- Refactored on.request.ts middleware to streamline authorization checks and improve error responses.
- Modified pre.validation.authenticate.ts to use updated alert response.
- Enhanced rumble.ts with improved error handling using to_error_object utility.
- Updated authentication.ts to use new alert response for dialog states.
- Refactored post.bookmark.api.search.index.ep.ts for cleaner import statements.
- Improved error handling and logging in dev.delete.collection.ep.ts and dev.post.database.reset.ep.ts.
- Updated dev.post.dev.user.ep.ts to remove unnecessary default user creation logic.
- Refactored dev.post.populate.collection.ep.ts to improve error handling and response structure.
- Removed deprecated post.user.create.default.ep.ts file.
- Enhanced user-related endpoints to utilize to_error_object for consistent error handling.
- Updated dialog state management in state/dialog/index.ts for better clarity and usage.
- Added utility function to_error_object for converting errors to a plain object for easier logging.

## `202512291732` Refactor error handling and logging across multiple endpoints

- Updated error handling to use a consistent error ID format for better traceability.
- Replaced default error responses with specific error ID responses in various endpoints.
- Enhanced logging to include error IDs and improved task logging for better debugging.
- Adjusted response structures to align with TJsonapiStateResponse for consistency.
- Modified state management and response handling in user and state-related endpoints.
- Cleaned up imports and removed unused error response imports.
- Improved task logging messages for clarity and consistency.
- Updated bookmark schema to simplify the is_private field.
- Refactored bootstrap app state to improve readability and maintainability.
- Added account link state functionality to nav link state management.

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