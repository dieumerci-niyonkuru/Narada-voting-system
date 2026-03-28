import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import './App.css'

import LandingPage from './components/common/LandingPage'
import MemberLogin from './components/auth/MemberLogin'
import MemberRegister from './components/auth/MemberRegister'
import AdminLogin from './components/auth/AdminLogin'
import MemberDashboard from './components/member/MemberDashboard'
import Voting from './components/voting/Voting'
import AdminPanel from './components/AdminPanel'

function App() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedSession = localStorage.getItem('narada_session')
    if (savedSession) {
      const session = JSON.parse(savedSession)
      setUser(session.user)
      setUserRole(session.user.role)
    }
    setLoading(false)
  }, [])

  const handleMemberLogin = (profile) => {
    setUser(profile)
    setUserRole(profile.role)
    toast.success(`Murakaza neza, ${profile.full_name || profile.phone}!`)
  }

  const handleAdminLogin = (profile) => {
    setUser(profile)
    setUserRole('admin')
    toast.success(`Murakaza neza, ${profile.full_name || 'Admin'}!`)
  }

  const handleLogout = () => {
    localStorage.removeItem('narada_session')
    setUser(null)
    setUserRole(null)
    toast.success('Wasohotse neza!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        {user && (
          <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center py-4">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <span className="text-2xl">Ì∑≥Ô∏è</span>
                  <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Narada Voting
                  </span>
                </Link>
                <div className="flex space-x-6">
                  <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition">Urubuga</Link>
                  <Link to="/vote" className="text-gray-700 hover:text-indigo-600 font-medium transition">Gutora</Link>
                  {userRole === 'admin' && (
                    <Link to="/admin" className="text-gray-700 hover:text-indigo-600 font-medium transition">Ubuyobozi</Link>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    {userRole === 'admin' ? 'Ì±ë Ubuyobozi' : `Ì≥± ${user.phone}`}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Sohoka
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/member-login" element={
            !user ? <MemberLogin onLogin={handleMemberLogin} onShowRegister={() => window.location.href = '/member-register'} /> : <Navigate to="/dashboard" />
          } />
          <Route path="/member-register" element={
            !user ? <MemberRegister onBack={() => window.location.href = '/member-login'} onRegisterSuccess={() => {
              toast.success('Iyandikishwa ryakozwe! Rindira ubuyobozi bukemeze konti yawe.')
              window.location.href = '/member-login'
            }} /> : <Navigate to="/dashboard" />
          } />
          <Route path="/admin-login" element={
            !user ? <AdminLogin onLogin={handleAdminLogin} /> : <Navigate to="/admin" />
          } />
          <Route path="/dashboard" element={
            user ? (userRole === 'admin' ? <AdminPanel /> : <MemberDashboard user={user} />) : <Navigate to="/" />
          } />
          <Route path="/vote" element={
            user ? <Voting user={user} /> : <Navigate to="/" />
          } />
          <Route path="/admin" element={
            user && userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
