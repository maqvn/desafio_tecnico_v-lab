import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CreateCourse } from './pages/CreateCourse';
import { CourseDetails } from './pages/CourseDetails';
import { EditCourse } from './pages/EditCourse';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/new" element={<CreateCourse />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/courses/:id/edit" element={<EditCourse />} />
      </Routes>
    </BrowserRouter>
  );
}