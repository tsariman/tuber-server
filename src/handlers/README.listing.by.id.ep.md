# Listing Endpoint with Bookmarks Pipeline

## Overview

The `GET /listings/:id` endpoint returns a single listing with all its associated bookmarks, formatted according to JSON:API specification.

## Endpoint

**URL**: `/listings/:id`  
**Method**: `GET`  
**Authentication**: Required (based on middleware configuration)

## Response Format

The response follows JSON:API specification with:

- **Primary data**: The listing object
- **Included resources**: Associated bookmarks
- **Relationships**: Links bookmarks to the listing

### Example Response

```json
{
  "data": {
    "type": "listings",
    "id": "64abc123def456789012345",
    "attributes": {
      "is_active": true,
      "is_private": false,
      "is_published": true,
      "name": "My Video Collection",
      "description": "A curated collection of educational videos",
      "user_id": "user123",
      "created_at": "2024-01-15T10:30:00.000Z",
      "modified_at": "2024-01-20T14:22:00.000Z",
      "slug": "my-video-collection",
      "tags": ["education", "science", "documentaries"]
    },
    "relationships": {
      "bookmarks": {
        "data": [
          { "type": "bookmarks", "id": "64abc789def012345678901" },
          { "type": "bookmarks", "id": "64abc789def012345678902" }
        ]
      }
    }
  },
  "included": [
    {
      "type": "bookmarks",
      "id": "64abc789def012345678901",
      "attributes": {
        "is_active": true,
        "is_private": false,
        "is_published": true,
        "user_id": "user123",
        "platform": "youtube",
        "start_seconds": 120,
        "end_seconds": 300,
        "title": "Introduction to Quantum Physics",
        "note": "Great explanation of quantum mechanics basics",
        "thumbnail_url": "https://img.youtube.com/vi/videoid/maxresdefault.jpg",
        "listing_metadata": {
          "html_tag": "h2",
          "is_private": false,
          "is_active": true,
          "created_at": "2024-01-15T10:35:00.000Z"
        }
      }
    }
  ]
}
```

## Features

### 1. MongoDB Aggregation Pipeline

The endpoint uses a sophisticated aggregation pipeline that:

- Matches the specific listing by ID
- Looks up associated bookmarks from the bookmarks collection
- Enriches bookmarks with listing-specific metadata (html_tag, privacy settings)
- Excludes sensitive fields (restrict, rules, reports)
- Handles ObjectId conversion for proper bookmark matching

### 2. JSON:API Compliance

- Primary resource: The listing
- Included resources: Associated bookmarks
- Relationships: Proper linkage between listing and bookmarks
- Error handling: Standard JSON:API error format

### 3. Security Features

- Validates ObjectId format
- Filters only active listings and bookmarks
- Excludes sensitive fields from response
- Respects privacy settings

## Error Responses

### 400 Bad Request
```json
{
  "errors": [{
    "status": "400",
    "title": "Bad Request",
    "detail": "Invalid listing ID format: 'invalid-id'"
  }]
}
```

### 404 Not Found
```json
{
  "errors": [{
    "status": "404",
    "title": "Not Found",
    "detail": "Listing with id '64abc123def456789012345' not found."
  }]
}
```

### 500 Internal Server Error
```json
{
  "errors": [{
    "status": "500",
    "title": "Internal Server Error",
    "detail": "An unexpected error occurred"
  }]
}
```

## Usage Examples

### Client-side JavaScript
```javascript
// Fetch listing with bookmarks
const response = await fetch('/listings/64abc123def456789012345', {
  headers: {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/vnd.api+json'
  }
});

const data = await response.json();

// Access listing attributes
const listing = data.data;
console.log('Listing name:', listing.attributes.name);

// Access included bookmarks
const bookmarks = data.included || [];
bookmarks.forEach(bookmark => {
  console.log('Bookmark:', bookmark.attributes.title);
  console.log('HTML tag:', bookmark.attributes.listing_metadata.html_tag);
});
```

### CURL Example
```bash
curl -X GET \
  "http://localhost:8080/listings/64abc123def456789012345" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/vnd.api+json"
```

## Implementation Details

### Pipeline Structure

1. **Match Stage**: Find the specific listing by ID and active status
2. **Lookup Stage**: 
   - Join with bookmarks collection
   - Handle ObjectId conversion for proper matching
   - Add listing-specific metadata to each bookmark
   - Filter out inactive bookmarks
3. **Project Stage**: Clean up response by removing sensitive fields

### Bookmark Metadata

Each bookmark in the response includes additional metadata from the listing:

- `html_tag`: The HTML element associated with this bookmark in the listing
- `is_private`: Privacy setting specific to this listing-bookmark relationship
- `is_active`: Active status specific to this listing-bookmark relationship
- `created_at`: When the bookmark was added to this listing
- `modified_at`: When the listing-bookmark relationship was last updated

This allows for rich display options where the same bookmark can have different metadata in different listings.
