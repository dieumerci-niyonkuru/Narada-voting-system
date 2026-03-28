import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

function LoginOTP({ onLogin }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) return cleaned
    return cleaned.slice(0, 10)
  }

  const sendOTP = async (e) => {
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
      toast.error('Phone number not registered. Please register first.')
      setLoading(false)
      return
    }

    if (!profile.is_approved) {
      toast.error('Account pending approval. Please wait for admin approval.')
      setLoading(false)
      return
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    await supabase.from('otp_codes').insert({
      phone: phone,
      code: otpCode,
      expires_at: new Date(Date.now() + 10 * 60000).toISOString()
    })

    toast.success(`Ì≥± OTP sent to ${phone}`)
    console.log(`OTP for ${phone}: ${otpCode}`)
    
    setStep('otp')
    setLoading(false)
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter 6-digit code')
      return
    }

    setLoading(true)
    
    const { data: otpData, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', otp)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !otpData) {
      toast.error('Invalid or expired OTP code')
      setLoading(false)
      return
    }

    await supabase.from('otp_codes').update({ is_used: true }).eq('id', otpData.id)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    const tempEmail = `${phone}@narada.voting`
    const tempPassword = otp
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: tempEmail,
      password: tempPassword
    })

    if (signInError) {
      await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          data: { phone: phone, full_name: profile.full_name }
        }
      })
    }

    toast.success('‚úì Login successful!')
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
          <form onSubmit={sendOTP}>
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
              <p className="text-xs text-gray-500 mt-2">Enter your registered 10-digit phone number</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Ì≥± Send OTP Code'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={verifyOTP}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium text-center">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength="6"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Code sent to +250 {phone}
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
            Ì¥í Secure OTP login ‚Ä¢ Your privacy matters
          </p>
          <p className="text-xs text-gray-400 mt-1">
            New member? Go back to landing page and click "Register Here"
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginOTP
