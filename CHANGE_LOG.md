
## `202512121503` Refactor error handling and access control in bookmark routes

- Updated `JsonapiErrorBuilder` to streamline error response creation.
- Changed `DatabaseError` code from 'DB_ERROR' to 'DATABASE_ERROR'.
- Enhanced `Access` class to include methods for checking user permissions on resources.
- Updated access control checks in bookmark-related endpoints to use new permission methods.
- Refactored bookmark retrieval and modification logic to ensure proper error handling and user permissions.
- Added platform-specific validation for bookmark data in POST and PATCH endpoints.
- Introduced `RequestDataValidator` tests to ensure validation logic for matching fields.
- Adjusted comments and documentation for clarity and consistency.