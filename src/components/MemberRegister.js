import React, { useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

function MemberRegister({ onBack, onRegisterSuccess }) {
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) return cleaned
    return cleaned.slice(0, 10)
  }

  const registerMember = async (e) => {
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
      toast.error('‚ùå This phone number is already registered. Please login.')
      setLoading(false)
      return
    }

    // Generate a temporary unique ID for the member
    const tempId = crypto.randomUUID()
    
    // Create profile with pending approval
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: tempId,
        phone: phone,
        full_name: fullName,
        email: email || null,
        role: 'member',
        is_approved: false,
        approval_code: null,
        created_at: new Date().toISOString()
      })

    if (profileError) {
      toast.error('Error creating profile: ' + profileError.message)
      setLoading(false)
      return
    }

    toast.success('Ìæâ Registration successful! Please wait for admin approval.')
    toast('Ì≥± Admin will provide your login code after approval.', {
      icon: 'Ì≥±',
      duration: 5000
    })
    
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

        <form onSubmit={registerMember}>
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Ì≥ù Register'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            ‚Üê Back to Login
          </button>
        </form>

        <div className="mt-6 pt-4 border-t text-center">
          <p className="text-xs text-gray-500">
            Ì¥í After registration, admin will approve your account
          </p>
        </div>
      </div>
    </div>
  )
}

export default MemberRegister
