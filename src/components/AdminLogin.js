import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        toast.error('‚ùå Invalid email or password')
        setLoading(false)
        return
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        toast.error('Ì¥í Access denied. Admin only.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Create session
      const sessionData = {
        user: profile,
        loggedInAt: new Date().toISOString()
      }
      localStorage.setItem('narada_session', JSON.stringify(sessionData))

      toast.success('Ì±ë Welcome Admin!')
      onLogin(profile)
      navigate('/admin')
    } catch (err) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">Ì±ë</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-600 mt-1">Secure Admin Access</p>
          <p className="text-xs text-gray-400 mt-2">Narada Voting Committee 2026</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Admin Email</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">Ì≥ß</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="admin@narada.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">Ì¥í</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? 'Ì±ÅÔ∏è' : 'Ì±ÅÔ∏è‚ÄçÌ∑®Ô∏è'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Ì¥ê Login as Admin'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Ì¥ê Secure admin access only
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
          >
            ‚Üê Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
