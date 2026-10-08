import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CitizenDashboard from './pages/citizen/Dashboard'
import ReportIssue from './pages/citizen/ReportIssue'
import MyIssues from './pages/citizen/MyIssues'
import CitizenIssueDetails from './pages/citizen/IssueDetails'
import Profile from './pages/citizen/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import AdminIssues from './pages/admin/Issues'
import AdminIssueDetails from './pages/admin/IssueDetails'
import AdminUsers from './pages/admin/Users'

export default function App() {
  return <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route element={<ProtectedRoute role="CITIZEN" />}>
      <Route path="/app" element={<CitizenDashboard />} />
      <Route path="/app/report" element={<ReportIssue />} />
      <Route path="/app/issues" element={<MyIssues />} />
      <Route path="/app/issues/:id" element={<CitizenIssueDetails />} />
      <Route path="/app/profile" element={<Profile />} />
    </Route>
    <Route element={<ProtectedRoute role="ADMIN" />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/issues" element={<AdminIssues />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/issues/:id" element={<AdminIssueDetails />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
