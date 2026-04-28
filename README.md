# 📚 Student Management System (MERN Stack)

A professional, production-ready Student Management System built with React, Node.js, Express, and MongoDB.

## ✨ Features

### ✅ Complete CRUD Operations
- ✨ **Create** - Add new students with photo upload
- 📖 **Read** - View all students with pagination
- ✏️ **Update** - Edit student details with image replacement
- 🗑️ **Delete** - Remove students from the system

### 🔐 Authentication
- Login page with demo credentials
- Session management with localStorage
- Protected routes
- Logout functionality

### 🔍 Advanced Features
- **Search & Filter** - Search students by name or course
- **Pagination** - 5 students per page with Next/Previous buttons
- **Photo Upload** - Upload student photos with multer
- **Image Display** - Student avatars in the table
- **Responsive Design** - Mobile, tablet, and desktop support

### 🎨 Professional UI
- Modern admin dashboard design
- Fixed sidebar navigation
- Styled forms with validation
- Responsive data table with hover effects
- Dashboard with real-time stats
- Professional color scheme

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File upload middleware
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 19** - UI library
- **React Router v7** - Routing
- **Axios** - HTTP client
- **Custom CSS** - Styling (no Bootstrap/Tailwind)

## 📋 Project Structure

```
student-management-system/
├── backend/
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── studentRoutes.js
│   ├── uploads/              (auto-created)
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   └── Sidebar.js
│   │   ├── Pages/
│   │   │   ├── Login.js
│   │   │   ├── AddStudent.js
│   │   │   ├── Students.js
│   │   │   └── UpdateStudent.js
│   │   ├── styles/
│   │   │   └── layout.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (running on localhost:27017)
- npm or yarn

### Backend Setup

```bash
# Navigate to project root
cd student-management-system

# Install dependencies
npm install

# Start with nodemon (development)
npm run dev

# OR start with node (production)
npm start

# Server will run on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start React development server
npm start

# App will run on http://localhost:3000
```

## 🔐 Login Credentials

**Demo Account:**
- **Email:** `admin@example.com`
- **Password:** `admin123`

## 📡 API Endpoints

### Students
- `GET /students/all` - Get all students (with pagination)
  - Query params: `?page=1&limit=5`
  - Response: `{ students: [], total: X, page: 1, pages: Y }`

- `GET /students/:id` - Get single student
  
- `POST /students/add` - Add new student (with file upload)
  - Body: FormData with name, email, phone, course, age, image
  
- `PUT /students/:id` - Update student (with file upload)
  - Body: FormData with updated fields
  
- `DELETE /students/:id` - Delete student
  
- `GET /students/search/query?q=...` - Search students
  - Query param: `?q=searchTerm`
  - Searches in name and course fields

## 🎯 Usage Guide

### 1. **Login**
- Navigate to http://localhost:3000
- Use demo credentials to login
- Redirects to dashboard on success

### 2. **View Dashboard**
- See real-time statistics:
  - Total Students
  - Active Courses
  - Total Teachers
  - Attendance Rate

### 3. **Manage Students**
- **View All:** Click "Students" in sidebar
- **Search:** Use search bar to filter by name/course
- **Pagination:** Navigate between pages using Next/Previous
- **Edit:** Click "Edit" button to update student info
- **Delete:** Click "Delete" button (with confirmation)

### 4. **Add New Student**
- Click "Add Student" in sidebar
- Fill in all required fields
- Upload student photo (optional)
- Click "Add Student" button
- Redirects to students list on success

### 5. **Update Student**
- Click "Edit" button in students table
- Update any field
- Change photo if needed
- Click "Update Student"
- Redirects to students list

### 6. **Logout**
- Click "Logout" button at bottom of sidebar
- Redirected to login page

## 🎨 UI Features

### Dashboard
- 4 stat cards with color coding
- Real-time data fetching
- Responsive grid layout

### Students Table
- Student photo column with avatars
- Sortable columns
- Hover effects
- Action buttons (Edit/Delete)
- Responsive horizontal scroll on mobile

### Forms
- Clean, professional layout
- Input validation
- Image preview
- Loading states
- Success/error messages

### Responsive Design
- **Desktop:** Full sidebar + content
- **Tablet:** Narrower sidebar
- **Mobile:** Compact layout with optimized touch targets

## 🔄 Pagination System

- **Default:** 5 students per page
- **Navigation:** Previous/Next buttons
- **Info:** Shows current page and total pages
- **Status:** Buttons disabled at boundaries
- **Search Override:** Single page for search results

## 🖼️ Image Upload

- **Accepted formats:** JPG, JPEG, PNG, GIF
- **Max size:** 5MB
- **Storage:** `/uploads` folder
- **Preview:** Before upload confirmation
- **URL:** `http://localhost:5000/uploads/filename`

## ⚙️ Configuration

### MongoDB
- **Connection:** `mongodb://127.0.0.1:27017/studentDB`
- **Port:** 27017
- **Database:** studentDB

### Server
- **Port:** 5000
- **CORS:** Enabled for localhost:3000

### Frontend
- **Port:** 3000
- **API Base:** `http://localhost:5000`

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Ensure MongoDB is running:
mongod
```

### Port Already in Use
```
Backend (5000): lsof -i :5000 | grep LISTEN && kill -9 PID
Frontend (3000): lsof -i :3000 | grep LISTEN && kill -9 PID
```

### File Upload Not Working
```
Check:
1. uploads/ folder exists
2. Read/write permissions in uploads/
3. File size < 5MB
4. File is image format
```

### Images Not Displaying
```
Verify:
1. Backend serving static files at /uploads
2. Image path in database is correct
3. API URL is correct (http://localhost:5000)
```

## 📱 Responsive Breakpoints

- **Desktop:** 1024px+
- **Tablet:** 768px - 1023px
- **Mobile:** Below 768px

## 🔒 Security Features

- Input validation on forms
- Protected routes with authentication
- CORS enabled
- File type validation for uploads
- Error handling on all endpoints
- SQL-like injection prevention with MongoDB

## 🚀 Deployment Ready

- Clean code structure
- Error handling
- Loading states
- Input validation
- Responsive design
- Modern UI/UX

## 📝 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Admin role management
- [ ] Attendance tracking
- [ ] Grade management
- [ ] Email notifications
- [ ] Bulk student import
- [ ] Student attendance reports
- [ ] Export to CSV/PDF
- [ ] Dark mode support

## 📄 License

MIT License

## 👨‍💻 Author

MERN Stack Student Management System

---

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Status:** ✅ Production Ready
