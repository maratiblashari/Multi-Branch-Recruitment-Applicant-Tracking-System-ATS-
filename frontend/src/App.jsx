import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home               from './pages/Home';
import Login              from './pages/Login';
import Register           from './pages/Register';
import JobDetails         from './pages/JobDetails';
import CandidateDashboard from './pages/CandidateDashboard';
import Profile            from './pages/Profile';
import AdminDashboard     from './pages/AdminDashboard';
import AdminJobs          from './pages/AdminJobs';
import JobForm            from './pages/JobForm';
import AdminApplications  from './pages/AdminApplications';
import AdminInterviews    from './pages/AdminInterviews';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '10px', fontWeight: 500 } }} />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            {/* Public */}
            <Route path="/"            element={<Home />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/jobs/:id"    element={<JobDetails />} />

            {/* Candidate Protected */}
            <Route path="/dashboard"   element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />
            <Route path="/profile"     element={<ProtectedRoute role="candidate"><Profile /></ProtectedRoute>} />

            {/* Admin Protected */}
            <Route path="/admin"                    element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/jobs"               element={<ProtectedRoute role="admin"><AdminJobs /></ProtectedRoute>} />
            <Route path="/admin/jobs/new"           element={<ProtectedRoute role="admin"><JobForm /></ProtectedRoute>} />
            <Route path="/admin/jobs/:id/edit"      element={<ProtectedRoute role="admin"><JobForm /></ProtectedRoute>} />
            <Route path="/admin/applications"       element={<ProtectedRoute role="admin"><AdminApplications /></ProtectedRoute>} />
            <Route path="/admin/interviews"         element={<ProtectedRoute role="admin"><AdminInterviews /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
