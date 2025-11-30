import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

function RequireAuth({ children }) {
  return localStorage.getItem('access') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<RequireAuth><Feed /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  )
}
