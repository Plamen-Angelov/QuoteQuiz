import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import StartScreen from './components/StartScreen'
import QuizPage from './components/QuizPage'
import SettingsPage from './components/SettingsPage'
import AdminDashboard from './components/AdminDashboard'
import UserManagement from './components/UserManagement'
import QuoteManagement from './components/QuoteManagement'
import UserAchievements from './components/UserAchievements'
import './App.css'

function App() {
  return (
    <QuizProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/quotes" element={<QuoteManagement />} />
          <Route path="/admin/achievements" element={<UserAchievements />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QuizProvider>
  )
}

export default App
