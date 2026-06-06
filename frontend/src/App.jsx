import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/ui/Toast'

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const InterviewPage = lazy(() => import('./pages/InterviewPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const SavedQuestionsPage = lazy(() => import('./pages/SavedQuestionsPage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/interview" element={<Protected><InterviewPage /></Protected>} />
        <Route path="/results" element={<Protected><ResultsPage /></Protected>} />
        <Route path="/history" element={<Protected><HistoryPage /></Protected>} />
        <Route path="/saved" element={<Protected><SavedQuestionsPage /></Protected>} />
        <Route path="/resume" element={<Protected><ResumePage /></Protected>} />
        <Route path="/roadmap" element={<Protected><RoadmapPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
