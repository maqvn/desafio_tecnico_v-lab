import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateCourse } from './pages/CreateCourse';
import { CourseDetails } from './pages/CourseDetails';
import { EditCourse } from './pages/EditCourse';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('@CourseSphere:token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/courses/new" element={<PrivateRoute><CreateCourse /></PrivateRoute>} />
        <Route path="/courses/:id" element={<PrivateRoute><CourseDetails /></PrivateRoute>} />
        <Route path="/courses/:id/edit" element={<PrivateRoute><EditCourse /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}