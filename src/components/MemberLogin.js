import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

function MemberLogin({ onLogin, onShowRegister }) {
  const [phone, setPhone] = useState('')
  const [approvalCode, setApprovalCode] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) return cleaned
    return cleaned.slice(0, 10)
  }

  const checkMember = async (e) => {
    e.preventDefault()
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !profile) {
      toast.error('‚ùå Phone number not registered. Please register first.')
      setLoading(false)
      return
    }

    if (!profile.is_approved) {
      toast.error('‚è≥ Account pending approval. Admin will provide login code.')
      setLoading(false)
      return
    }

    // Member is approved, ask for approval code
    setStep('code')
    setLoading(false)
  }

  const verifyCode = async (e) => {
    e.preventDefault()
    if (approvalCode.length < 4) {
      toast.error('Please enter your login code')
      return
    }

    setLoading(true)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .eq('approval_code', approvalCode.toUpperCase())
      .single()

    if (error || !profile) {
      toast.error('‚ùå Invalid login code. Please contact admin.')
      setLoading(false)
      return
    }

    // Update last login
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', profile.id)

    // Create session in localStorage
    const sessionData = {
      user: profile,
      loggedInAt: new Date().toISOString()
    }
    localStorage.setItem('narada_session', JSON.stringify(sessionData))

    toast.success(`Ìæâ Welcome ${profile.full_name || 'Member'}!`)
    onLogin(profile)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">Ì∑≥Ô∏è</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Member Login
          </h1>
          <p className="text-gray-600 mt-1">Narada Voting Committee 2026</p>
        </div>

        {step === 'phone' && (
          <>
            <form onSubmit={checkMember}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                <div className="flex gap-2">
                  <span className="bg-gray-100 px-3 py-3 rounded-lg text-gray-600 font-semibold">+250</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="788XXXXXX"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    maxLength="10"
                    autoFocus
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Enter your registered phone number</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Ì≥± Continue'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-gray-600 mb-2">Don't have an account?</p>
              <button
                onClick={onShowRegister}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg"
              >
                ‚ú® Register as New Member
              </button>
            </div>
          </>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode}>
            <div className="mb-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-blue-700 text-sm">‚úì Account found for +250 {phone}</p>
                <p className="text-xs text-blue-600 mt-1">Enter your login code provided by admin</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium text-center">Login Code</label>
              <input
                type="text"
                value={approvalCode}
                onChange={(e) => setApprovalCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                placeholder="Enter 8-character code"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength="8"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Code provided by admin after approval
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Verifying...' : '‚úì Verify & Login'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
            >
              ‚Üê Back to phone number
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Ì¥í Secure login with admin-provided code
          </p>
        </div>
      </div>
    </div>
  )
}

export default MemberLogin
