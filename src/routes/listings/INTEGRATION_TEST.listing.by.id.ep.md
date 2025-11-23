# Integration Test Example for Listing Endpoint

This file demonstrates how to test the `/listings/:id` endpoint in a real environment.

## Prerequisites

1. MongoDB instance running with sample data
2. Server running on localhost:8080
3. Valid JWT token for authentication

## Sample Data Setup

First, create a sample listing with bookmarks:

```javascript
// Sample listing document
{
  _id: ObjectId("64abc123def456789012345"),
  name: "Science Documentaries",
  description: "A collection of educational science videos",
  is_active: true,
  is_private: false,
  is_published: true,
  user_id: "user123",
  created_at: new Date("2024-01-15T10:30:00.000Z"),
  modified_at: new Date("2024-01-20T14:22:00.000Z"),
  tags: ["science", "education", "documentaries"],
  bookmarks: [
    {
      bookmark_id: "64abc789def012345678901",
      html_tag: "h2",
      is_private: false,
      is_active: true,
      created_at: new Date("2024-01-15T10:35:00.000Z")
    },
    {
      bookmark_id: "64abc789def012345678902", 
      html_tag: "h3",
      is_private: false,
      is_active: true,
      created_at: new Date("2024-01-16T09:15:00.000Z")
    }
  ]
}

// Sample bookmark documents
{
  _id: ObjectId("64abc789def012345678901"),
  title: "The Universe Explained",
  platform: "youtube",
  videoid: "abc123",
  start_seconds: 120,
  end_seconds: 300,
  is_active: true,
  is_private: false,
  is_published: true,
  user_id: "user123",
  created_at: new Date("2024-01-10T08:00:00.000Z")
}

{
  _id: ObjectId("64abc789def012345678902"),
  title: "Quantum Mechanics Basics",
  platform: "youtube", 
  videoid: "def456",
  start_seconds: 60,
  end_seconds: 180,
  is_active: true,
  is_private: false,
  is_published: true,
  user_id: "user123",
  created_at: new Date("2024-01-12T14:30:00.000Z")
}
```

## Test Cases

### 1. Successful Request

```bash
curl -X GET \
  "http://localhost:8080/listings/64abc123def456789012345" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/vnd.api+json" \
  -H "Accept: application/vnd.api+json"
```

**Expected Response (200 OK):**
```json
{
  "data": {
    "type": "listings",
    "id": "64abc123def456789012345",
    "attributes": {
      "name": "Science Documentaries",
      "description": "A collection of educational science videos",
      "is_active": true,
      "is_private": false,
      "is_published": true,
      "user_id": "user123",
      "created_at": "2024-01-15T10:30:00.000Z",
      "modified_at": "2024-01-20T14:22:00.000Z",
      "tags": ["science", "education", "documentaries"]
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
        "title": "The Universe Explained",
        "platform": "youtube",
        "videoid": "abc123",
        "start_seconds": 120,
        "end_seconds": 300,
        "is_active": true,
        "is_private": false,
        "is_published": true,
        "user_id": "user123",
        "created_at": "2024-01-10T08:00:00.000Z",
        "listing_metadata": {
          "html_tag": "h2",
          "is_private": false,
          "is_active": true,
          "created_at": "2024-01-15T10:35:00.000Z"
        }
      }
    },
    {
      "type": "bookmarks", 
      "id": "64abc789def012345678902",
      "attributes": {
        "title": "Quantum Mechanics Basics",
        "platform": "youtube",
        "videoid": "def456", 
        "start_seconds": 60,
        "end_seconds": 180,
        "is_active": true,
        "is_private": false,
        "is_published": true,
        "user_id": "user123",
        "created_at": "2024-01-12T14:30:00.000Z",
        "listing_metadata": {
          "html_tag": "h3",
          "is_private": false,
          "is_active": true,
          "created_at": "2024-01-16T09:15:00.000Z"
        }
      }
    }
  ]
}
```

### 2. Invalid ID Format

```bash
curl -X GET \
  "http://localhost:8080/listings/invalid-id" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/vnd.api+json"
```

**Expected Response (400 Bad Request):**
```json
{
  "errors": [{
    "status": "400",
    "title": "Bad Request", 
    "detail": "Invalid listing ID format: 'invalid-id'"
  }]
}
```

### 3. Listing Not Found

```bash
curl -X GET \
  "http://localhost:8080/listings/64abc123def456789012999" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/vnd.api+json"
```

**Expected Response (404 Not Found):**
```json
{
  "errors": [{
    "status": "404",
    "title": "Not Found",
    "detail": "Listing with id '64abc123def456789012999' not found."
  }]
}
```

### 4. Unauthorized Access

```bash
curl -X GET \
  "http://localhost:8080/listings/64abc123def456789012345" \
  -H "Content-Type: application/vnd.api+json"
```

**Expected Response (401 Unauthorized):**
```json
{
  "errors": [{
    "status": "401",
    "title": "Unauthorized",
    "detail": "Authentication required"
  }]
}
```

## Client Implementation Example

```javascript
class ListingService {
  constructor(baseUrl, authToken) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  async getListingWithBookmarks(listingId) {
    try {
      const response = await fetch(`${this.baseUrl}/listings/${listingId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.errors[0].detail}`);
      }

      const data = await response.json();
      
      // Transform JSON:API response to a more usable format
      return {
        listing: {
          id: data.data.id,
          ...data.data.attributes
        },
        bookmarks: (data.included || []).map(bookmark => ({
          id: bookmark.id,
          ...bookmark.attributes
        }))
      };
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      throw error;
    }
  }
}

// Usage
const service = new ListingService('http://localhost:8080', 'your-jwt-token');

service.getListingWithBookmarks('64abc123def456789012345')
  .then(result => {
    console.log('Listing:', result.listing.name);
    console.log('Bookmarks count:', result.bookmarks.length);
    
    result.bookmarks.forEach(bookmark => {
      console.log(`- ${bookmark.title} (${bookmark.listing_metadata.html_tag})`);
    });
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Performance Notes

- The aggregation pipeline is optimized to minimize database queries
- Only active listings and bookmarks are returned
- Sensitive fields (restrict, rules, reports) are excluded from responses
- ObjectId validation prevents unnecessary database queries for invalid IDs
- The lookup operation uses indexes on _id fields for optimal performance
