import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function AdminLoginBypass({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    
    // Get admin profile directly from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .eq('is_approved', true)
      .single()

    if (profile) {
      toast.success('Ì±ë Welcome Admin!')
      onLogin(profile)
      navigate('/admin')
    } else {
      toast.error('No admin found. Please create admin profile.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-7xl mb-3">Ì±ë</div>
        <h1 className="text-3xl font-bold mb-4">Admin Portal</h1>
        <p className="text-gray-600 mb-6">Quick Access for Testing</p>
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Ì¥ê Click to Login as Admin'}
        </button>
        
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => window.location.href = '/'}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            ‚Üê Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginBypass
