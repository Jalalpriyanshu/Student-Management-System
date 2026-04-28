import './styles/layout.css';
import './styles/responsive.css';
import Sidebar        from './components/Sidebar';
import Navbar         from './components/Navbar';
import Dashboard      from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Students       from './Pages/Students';
import AddStudent     from './Pages/AddStudent';
import UpdateStudent  from './Pages/UpdateStudent';
import Login          from './Pages/Login';
import Register       from './Pages/Register';
import Reports        from './Pages/Reports';
import Attendance     from './Pages/Attendance';
import Marks          from './Pages/Marks';
import Timetable      from './Pages/Timetable';
import StudentProfile from './Pages/StudentProfile';
import Settings       from './Pages/Settings';
import IDCards        from './Pages/IDCards';
import Fees          from './Pages/Fees';
import { ToastProvider } from './components/Toast';

const ProtectedLayout = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-body">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/students"      element={<Students />} />
            <Route path="/add"           element={<AddStudent />} />
            <Route path="/update/:id"    element={<UpdateStudent />} />
            <Route path="/reports"       element={<Reports />} />
            <Route path="/attendance"    element={<Attendance />} />
            <Route path="/marks"         element={<Marks />} />
            <Route path="/timetable"     element={<Timetable />} />
            <Route path="/profile/:id"   element={<StudentProfile />} />
            <Route path="/my-profile"    element={<StudentProfile />} />
            <Route path="/settings"      element={<Settings />} />
            <Route path="/id-cards"      element={<IDCards />} />
            <Route path="/fees"          element={<Fees />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*"        element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
