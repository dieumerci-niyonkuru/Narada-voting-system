import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

function MemberRegisterPage({ onBack, onRegisterSuccess }) {
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('register')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) return cleaned
    return cleaned.slice(0, 10)
  }

  const sendOTPForRegistration = async (e) => {
    e.preventDefault()
    
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    if (!fullName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    setLoading(true)

    // Check if phone already registered
    const { data: existing } = await supabase
      .from('profiles')
      .select('phone')
      .eq('phone', phone)
      .single()

    if (existing) {
      toast.error('‚ùå This phone number is already registered. Please login instead.')
      setLoading(false)
      return
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otpCode)
    
    // Store OTP in database
    await supabase.from('otp_codes').insert({
      phone: phone,
      code: otpCode,
      expires_at: new Date(Date.now() + 10 * 60000).toISOString()
    })

    // Show OTP in an alert for easy testing
    alert(`Ì¥ë Your verification code is: ${otpCode}\n\nPlease enter this code to complete registration.`)
    
    toast.success(`Ì≥± Verification code sent to +250 ${phone}`)
    console.log(`Ì¥ë Verification code for ${phone}: ${otpCode}`)
    
    setStep('verify')
    setLoading(false)
  }

  const verifyAndRegister = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast.error('Please enter 6-digit code')
      return
    }

    setLoading(true)

    // Verify OTP
    const { data: otpData, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', otp)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !otpData) {
      toast.error('‚ùå Invalid or expired verification code')
      setLoading(false)
      return
    }

    // Mark OTP as used
    await supabase.from('otp_codes').update({ is_used: true }).eq('id', otpData.id)

    // Create temporary email for auth
    const tempEmail = `${phone}@narada.member`
    const tempPassword = otp

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: tempEmail,
      password: tempPassword,
      options: {
        data: { 
          phone: phone,
          full_name: fullName
        }
      }
    })

    if (authError) {
      toast.error('Registration error: ' + authError.message)
      setLoading(false)
      return
    }

    // Create profile with pending approval
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        phone: phone,
        full_name: fullName,
        email: email || null,
        role: 'member',
        is_approved: false
      })

    if (profileError) {
      toast.error('Error creating profile')
      setLoading(false)
      return
    }

    alert('‚úÖ Registration successful! Please wait for admin approval.')
    toast.success('Ìæâ Registration successful! Please wait for admin approval.')
    
    setTimeout(() => {
      onRegisterSuccess()
    }, 2000)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">‚ú®</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Member Registration
          </h1>
          <p className="text-gray-600 mt-1">Join Narada Voting Committee 2026</p>
        </div>

        {step === 'register' && (
          <form onSubmit={sendOTPForRegistration}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Phone Number *</label>
              <div className="flex gap-2">
                <span className="bg-gray-100 px-3 py-2 rounded-lg text-gray-600">+250</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                  placeholder="788XXXXXX"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength="10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter your 10-digit phone number</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">We'll use this for important notifications</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Ì≥± Send Verification Code'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              ‚Üê Back to Login
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyAndRegister}>
            <div className="mb-4 text-center">
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">‚úì Verification code sent to +250 {phone}</p>
                <p className="text-xs text-green-600 mt-1">Check the popup alert for your code</p>
              </div>
            </div>
            
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
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Verifying...' : '‚úì Verify & Register'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep('register')
              }}
              className="w-full mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
            >
              ‚Üê Back to Registration
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Ì¥í After registration, admin will approve your account
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You'll receive OTP for login after approval
          </p>
        </div>
      </div>
    </div>
  )
}

export default MemberRegisterPage
