# 🚀 QUICK START GUIDE

## ⚡ 5-Minute Setup

### Step 1: Start MongoDB
```bash
mongod
```
✅ Keep this running in background

---

### Step 2: Start Backend Server
```bash
cd d:\student-management-system
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected
🚀 Server started on http://localhost:5000
```

---

### Step 3: Start Frontend
**In a new terminal:**
```bash
cd d:\student-management-system\frontend
npm start
```

**Expected Output:**
```
webpack compiled successfully
Compiled successfully!
On Your Network: http://192.168.x.x:3000
Local: http://localhost:3000
```

Browser opens automatically at http://localhost:3000

---

### Step 4: Login
**Credentials:**
- **Email:** `admin@example.com`
- **Password:** `admin123`

Click "🔐 Login"

---

## 🎯 Main Features to Try

### 1. 📊 Dashboard
- View live statistics
- Total students count
- Active courses
- Click "Dashboard" in sidebar

### 2. ➕ Add Student
- Click "Add Student" in sidebar
- Fill in all fields
- Upload a photo (optional)
- Click "Add Student"

### 3. 👥 View Students
- Click "Students" in sidebar
- See all students with photos
- Use search bar to filter
- Click Next/Previous to paginate

### 4. ✏️ Edit Student
- Click "Edit" button in table
- Update any information
- Change photo if needed
- Click "Update Student"

### 5. 🗑️ Delete Student
- Click "Delete" button in table
- Confirm in dialog
- Student removed instantly

### 6. 🚪 Logout
- Click "Logout" button at bottom of sidebar
- Confirm logout
- Redirected to login page

---

## 📁 Folder Structure

```
D:\student-management-system\
├── server.js                    (Main backend file)
├── models/
│   └── Student.js              (Database schema)
├── routes/
│   └── studentRoutes.js         (API endpoints)
├── uploads/                     (Student photos - auto-created)
├── frontend/
│   └── src/
│       ├── Pages/              (Forms & Lists)
│       ├── components/         (Sidebar, Dashboard)
│       └── styles/             (layout.css)
├── package.json                (Backend dependencies)
├── README.md                   (Full documentation)
└── API_REFERENCE.md            (API endpoints)
```

---

## 🧪 Quick Tests

### ✅ Test 1: Add Student
1. Click "Add Student"
2. Enter: Name, Email, Phone, Course
3. Upload any image
4. Click "Add Student"
5. ✓ Should see new student in list

### ✅ Test 2: Search
1. Go to "Students"
2. Type in search box: "Computer"
3. ✓ Should filter students by name/course

### ✅ Test 3: Pagination
1. Go to "Students"
2. Click "Next →" button
3. ✓ Should show next 5 students

### ✅ Test 4: Edit
1. Click "Edit" button
2. Change name to "Test User"
3. Click "Update Student"
4. ✓ Name should update

### ✅ Test 5: Delete
1. Click "Delete" button
2. Confirm in dialog
3. ✓ Student should disappear

---

## 🔧 Troubleshooting

### Issue: "MongoDB connection error"
**Solution:**
```bash
# Make sure MongoDB is running
mongod
```

### Issue: "Cannot find module 'multer'"
**Solution:**
```bash
cd d:\student-management-system
npm install
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill process on port 5000
lsof -i :5000 | grep LISTEN
kill -9 <PID>

# Or use different port in server.js
```

### Issue: "Photos not displaying"
**Solution:**
1. Check uploads folder exists: `d:\student-management-system\uploads\`
2. Check backend is running on :5000
3. Check image path in MongoDB

### Issue: "Login not working"
**Solution:**
- Use exact credentials: `admin@example.com` / `admin123`
- Check browser console for errors
- Make sure frontend is on :3000

---

## 📱 Mobile Testing

### Test Responsive Design
1. Open DevTools: F12
2. Click device toggle (mobile icon)
3. Try different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1024px

### Mobile-Specific Features
- ✓ Sidebar collapses
- ✓ Search bar responsive
- ✓ Table scrolls horizontally
- ✓ Buttons stack properly
- ✓ Photos display correctly

---

## 📊 API Quick Reference

### All Students
```
GET http://localhost:5000/students/all?page=1&limit=5
```

### Search
```
GET http://localhost:5000/students/search/query?q=Computer
```

### Add Student
```
POST http://localhost:5000/students/add
(with multipart form data)
```

### Update Student
```
PUT http://localhost:5000/students/:id
(with multipart form data)
```

### Delete Student
```
DELETE http://localhost:5000/students/:id
```

---

## 📞 Need Help?

1. **Check README.md** - Full documentation
2. **Check API_REFERENCE.md** - API endpoints
3. **Check COMPLETION_SUMMARY.md** - What was done
4. **Browser Console** (F12) - Error messages
5. **Terminal** - Server logs

---

## ✨ Key Features at a Glance

| Feature | Status | Location |
|---------|--------|----------|
| Login | ✅ | Login Page |
| Add Student | ✅ | Add Student Form |
| View Students | ✅ | Students List |
| Search | ✅ | Students List (Search box) |
| Pagination | ✅ | Students List (Next/Prev) |
| Edit Student | ✅ | Edit Form |
| Delete Student | ✅ | Students List (Delete btn) |
| Photo Upload | ✅ | Add/Edit Forms |
| Photo Display | ✅ | Students Table |
| Responsive | ✅ | All Pages |
| Dashboard Stats | ✅ | Dashboard Page |
| Logout | ✅ | Sidebar (Logout btn) |

---

## 🎓 Learning Path

### Beginner
1. Login with demo credentials
2. View dashboard
3. Browse students list
4. Try search feature

### Intermediate
1. Add a new student
2. Upload a photo
3. Navigate pages
4. Test search filters

### Advanced
1. Edit student details
2. Replace student photo
3. Try API endpoints with cURL
4. Check MongoDB data

---

## 🚀 Ready?

**All three services running?**
- ✅ MongoDB on :27017
- ✅ Backend on :5000
- ✅ Frontend on :3000

**Then you're ready to go!** 🎉

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Use  
**Last Updated:** April 28, 2026
