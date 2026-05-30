import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar          from './components/Navbar'
import ProtectedRoute  from './components/ProtectedRoute'
import ToastContainer  from './components/Toast'

import HomePage           from './pages/HomePage'
import LoginPage          from './pages/LoginPage'
import SignupPage         from './pages/SignupPage'
import DashboardPage      from './pages/DashboardPage'
import InterviewPage      from './pages/InterviewPage'
import ResultsPage        from './pages/ResultsPage'
import HistoryPage        from './pages/HistoryPage'
import SavedQuestionsPage from './pages/SavedQuestionsPage'
import ProfilePage        from './pages/ProfilePage'
import SettingsPage       from './pages/SettingsPage'
import NotFoundPage       from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
        <Route path="/results"   element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/history"   element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/saved"     element={<ProtectedRoute><SavedQuestionsPage /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*"          element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}