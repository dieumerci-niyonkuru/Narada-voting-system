import React, { useState } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SocialFooter from '../common/SocialFooter'
import Icon from '../common/Icon'

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Shyiramo email n\'ijambobanga')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        toast.error('‚ùå Email cyangwa ijambobanga bitemewe')
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        toast.error('Ì¥í Ntabwo urimo ubuyobozi. Urujira rwabujijwe.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      const sessionData = {
        user: profile,
        loggedInAt: new Date().toISOString()
      }
      localStorage.setItem('narada_session', JSON.stringify(sessionData))

      toast.success('Ì±ë Murakaza neza, Ubuyobozi!')
      onLogin(profile)
      navigate('/admin')
    } catch (err) {
      toast.error('Kwinjira byananiwe. Ongera ugerageze.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 mb-4 text-sm flex items-center gap-1">
              <Icon name="back" /> Subira ku rubuga rukuru
            </button>
            <Icon name="admin" size="text-6xl" className="mb-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Kwinjira nk'Ubuyobozi
            </h1>
            <p className="text-gray-600 mt-1">Narada Voting Committee 2026</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Icon name="email" /> Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><Icon name="email" /></span>
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
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Icon name="lock" /> Ijambobanga
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400"><Icon name="lock" /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ijambobanga"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Icon name="loading" className="animate-spin" /> Binjiza...</> : <><Icon name="login" /> Kwinjira</>}
            </button>
          </form>
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default AdminLogin
