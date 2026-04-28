# 📡 API ENDPOINTS REFERENCE

## Base URL
```
http://localhost:5000
```

---

## 🟢 Student Endpoints

### 1. Get All Students (with Pagination)
**Request:**
```http
GET /api/students/all?page=1&limit=5
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 5) - Items per page

**Response (200 OK):**
```json
{
  "students": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "course": "Computer Science",
      "age": 20,
      "image": "uploads/image-1234567890.jpg",
      "createdAt": "2024-04-28T10:30:00Z",
      "updatedAt": "2024-04-28T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 3
}
```

---

### 2. Get Single Student
**Request:**
```http
GET /api/students/:id
```

**Example:**
```http
GET /api/students/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "course": "Computer Science",
  "age": 20,
  "image": "uploads/image-1234567890.jpg",
  "createdAt": "2024-04-28T10:30:00Z",
  "updatedAt": "2024-04-28T10:30:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Student not found"
}
```

---

### 3. Add New Student (with Image Upload)
**Request:**
```http
POST /api/students/add
Content-Type: multipart/form-data

Form Data:
- name: "John Doe" (required)
- email: "john@example.com" (required)
- phone: "1234567890" (required)
- course: "Computer Science" (required)
- age: "20" (optional)
- image: <file> (optional)
```

**Response (201 Created):**
```json
{
  "message": "Student added successfully",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "course": "Computer Science",
    "age": 20,
    "image": "uploads/image-1234567890.jpg",
    "createdAt": "2024-04-28T10:30:00Z",
    "updatedAt": "2024-04-28T10:30:00Z"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "error": "Name, Email, Phone, and Course are required"
}
```

---

### 4. Update Student (with Image Upload)
**Request:**
```http
PUT /api/students/:id
Content-Type: multipart/form-data

Form Data:
- name: "Jane Doe" (required)
- email: "jane@example.com" (required)
- phone: "0987654321" (required)
- course: "Data Science" (required)
- age: "21" (optional)
- image: <file> (optional, replaces existing)
```

**Example:**
```http
PUT /api/students/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "message": "Student updated successfully",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "0987654321",
    "course": "Data Science",
    "age": 21,
    "image": "uploads/image-9876543210.jpg",
    "createdAt": "2024-04-28T10:30:00Z",
    "updatedAt": "2024-04-28T11:45:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": "Student not found"
}
```

---

### 5. Delete Student
**Request:**
```http
DELETE /api/students/:id
```

**Example:**
```http
DELETE /api/students/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "message": "Student deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "error": "Student not found"
}
```

---

### 6. Search Students
**Request:**
```http
GET /api/students/search/query?q=searchTerm
```

**Query Parameters:**
- `q` (required) - Search term (searches in name and course)

**Example:**
```http
GET /api/students/search/query?q=Computer
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "course": "Computer Science",
    "age": 20,
    "image": "uploads/image-1234567890.jpg",
    "createdAt": "2024-04-28T10:30:00Z",
    "updatedAt": "2024-04-28T10:30:00Z"
  }
]
```

**Response (400 Bad Request):**
```json
{
  "error": "Search query required"
}
```

---

## 🟡 Health Check
**Request:**
```http
GET /
```

**Response (200 OK):**
```json
{
  "message": "✅ Server is running"
}
```

---

## ⚠️ Error Responses

### 400 - Bad Request
```json
{
  "error": "Description of what went wrong"
}
```

### 404 - Not Found
```json
{
  "error": "Student not found"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## 📝 Data Models

### Student Object
```json
{
  "_id": "ObjectId",           // MongoDB ID (auto-generated)
  "name": "String",             // Required
  "email": "String",            // Required, unique
  "phone": "String",            // Required
  "course": "String",           // Required
  "age": "Number",              // Optional
  "image": "String",            // Optional, path to image file
  "createdAt": "Date",          // Auto-generated
  "updatedAt": "Date"           // Auto-generated
}
```

---

## 🧪 cURL Examples

### Get All Students
```bash
curl -X GET "http://localhost:5000/api/students/all?page=1&limit=5"
```

### Get Single Student
```bash
curl -X GET "http://localhost:5000/api/students/507f1f77bcf86cd799439011"
```

### Add Student
```bash
curl -X POST "http://localhost:5000/api/students/add" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=1234567890" \
  -F "course=Computer Science" \
  -F "age=20" \
  -F "image=@/path/to/image.jpg"
```

### Update Student
```bash
curl -X PUT "http://localhost:5000/api/students/507f1f77bcf86cd799439011" \
  -F "name=Jane Doe" \
  -F "email=jane@example.com" \
  -F "phone=0987654321" \
  -F "course=Data Science"
```

### Delete Student
```bash
curl -X DELETE "http://localhost:5000/api/students/507f1f77bcf86cd799439011"
```

### Search Students
```bash
curl -X GET "http://localhost:5000/api/students/search/query?q=Computer"
```

---

## 📊 Pagination Details

### Example Request
```http
GET /api/students/all?page=2&limit=5
```

### Example Response
```json
{
  "students": [...],
  "total": 25,           // Total number of students
  "page": 2,             // Current page
  "pages": 5             // Total number of pages
}
```

### Calculation
- Total Pages = Math.ceil(total / limit)
- Skip Count = (page - 1) * limit
- Current Items = 5 (or fewer on last page)

---

## 🖼️ Image Upload Details

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

### Constraints
- Maximum file size: 5 MB
- Stored in: `/uploads` folder
- Access URL: `http://localhost:5000/uploads/filename`

### File Naming
- Format: `{fieldname}-{timestamp}-{randomstring}.{ext}`
- Example: `image-1234567890-9876543.jpg`

---

## 🔍 Search Behavior

### Search Query (Case-Insensitive)
- Searches in `name` field (regex)
- Searches in `course` field (regex)
- Uses MongoDB `$or` operator
- Returns all matching students (no pagination)

### Example
```
Query: "computer"
Matches:
- "Computer Science" (course)
- "John Computer" (name)
```

---

**API Version:** 1.0.0  
**Last Updated:** April 28, 2026  
**Status:** ✅ Production Ready
