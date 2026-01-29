# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

Most endpoints require authentication using Laravel Sanctum. Include the token in the Authorization header:

```
Authorization: Bearer {your_token}
```

## Endpoints

### Public Endpoints

#### GET /researches
Get all researches with pagination and filtering.

**Query Parameters:**
- `search` (string, optional) - Search in title, content, writer, publisher, keywords
- `writer` (string, optional) - Filter by writer name
- `publisher` (string, optional) - Filter by publisher name
- `keywords` (string|array, optional) - Filter by keywords (comma-separated or array)
- `sort_by` (string, optional) - Sort by: `published_at`, `created_at`, `views`, `title` (default: `published_at`)
- `sort_order` (string, optional) - Sort order: `asc` or `desc` (default: `desc`)
- `per_page` (integer, optional) - Items per page, max 100 (default: 15)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Research Title",
      "content_plain": "Plain text content",
      "content_html": "<p>HTML content</p>",
      "published_at": "2024-01-15",
      "writer": "Writer Name",
      "publisher": "Publisher Name",
      "keywords": ["keyword1", "keyword2"],
      "views": 100,
      "created_by": "uuid-here",
      "created_at": "2024-01-15T10:00:00.000000Z",
      "updated_at": "2024-01-15T10:00:00.000000Z",
      "creator": {
        "id": "uuid-here",
        "name": "Creator Name",
        "role": "publisher"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

#### GET /researches/{id}
Get a single research by ID. Automatically increments views.

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Research Title",
    "content_plain": "Plain text content",
    "content_html": "<p>HTML content</p>",
    "published_at": "2024-01-15",
    "writer": "Writer Name",
    "publisher": "Publisher Name",
    "keywords": ["keyword1", "keyword2"],
    "views": 101,
    "created_by": "uuid-here",
    "created_at": "2024-01-15T10:00:00.000000Z",
    "updated_at": "2024-01-15T10:00:00.000000Z",
    "creator": {
      "id": "uuid-here",
      "name": "Creator Name",
      "role": "publisher"
    }
  }
}
```

#### POST /researches/{id}/increment-views
Manually increment views for a research.

**Response:**
```json
{
  "message": "Views incremented",
  "views": 102
}
```

### Authenticated Endpoints

#### GET /profile
Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "id": "uuid-here",
    "name": "User Name",
    "role": "publisher",
    "created_at": "2024-01-15T10:00:00.000000Z"
  }
}
```

#### PUT /profile
Update authenticated user's profile.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "New Name",
  "role": "viewer"  // Only admins can change role
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-here",
    "name": "New Name",
    "role": "viewer",
    "created_at": "2024-01-15T10:00:00.000000Z"
  }
}
```

#### POST /researches
Create a new research (publisher/admin only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Research Title",
  "content_plain": "Plain text content",
  "content_html": "<p>HTML content</p>",
  "published_at": "2024-01-15",
  "writer": "Writer Name",
  "publisher": "Publisher Name",
  "keywords": ["keyword1", "keyword2"]
}
```

**Response:**
```json
{
  "message": "Research created successfully",
  "data": {
    "id": 1,
    "title": "Research Title",
    ...
  }
}
```

#### PUT /researches/{id}
Update a research (owner/admin only).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "content_plain": "Updated content",
  "content_html": "<p>Updated HTML</p>",
  "published_at": "2024-01-16",
  "writer": "Updated Writer",
  "publisher": "Updated Publisher",
  "keywords": ["new", "keywords"]
}
```

**Response:**
```json
{
  "message": "Research updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    ...
  }
}
```

#### DELETE /researches/{id}
Delete a research (owner/admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Research deleted successfully"
}
```

### Admin Only Endpoints

#### GET /profiles
Get all profiles (admin only).

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `per_page` (integer, optional) - Items per page (default: 15)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-here",
      "name": "User Name",
      "role": "publisher",
      "created_at": "2024-01-15T10:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "title": ["The title field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized. Only publishers and admins can create researches."
}
```

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\Research] 1"
}
```

### 500 Server Error
```json
{
  "message": "Server Error"
}
```

## Rate Limiting

API requests are rate-limited to 60 requests per minute per IP/user.

## CORS

CORS is enabled for all origins. Configure in `config/cors.php` for production.

