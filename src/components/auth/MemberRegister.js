import React, { useState } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SocialFooter from '../common/SocialFooter'
import Icon from '../common/Icon'

function MemberRegister({ onBack, onRegisterSuccess }) {
  const [phone, setPhone] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) return cleaned
    return cleaned.slice(0, 10)
  }

  const registerMember = async (e) => {
    e.preventDefault()
    
    if (phone.length !== 10) {
      toast.error('Shyiramo numero ya telefoni y\'imyaka 10')
      return
    }

    if (!fullName.trim()) {
      toast.error('Shyiramo izina ryawe ryose')
      return
    }

    setLoading(true)

    try {
      // Check if phone already registered
      const { data: existing } = await supabase
        .from('profiles')
        .select('phone')
        .eq('phone', phone)
        .single()

      if (existing) {
        toast.error('âŒ Iyi numero imaze kwandikwa. Kwinjira hanyuma.')
        setLoading(false)
        return
      }

      // Generate a unique ID for the member (no auth user needed)
      const tempId = crypto.randomUUID()

      // Create profile directly without auth user
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
        console.error('Profile error:', profileError)
        toast.error('Error creating profile: ' + profileError.message)
        setLoading(false)
        return
      }

      toast.success('í¾‰ Iyandikishwa ryakozwe! Rindira ubuyobozi bukemeze konti yawe.')
      
      setTimeout(() => {
        onRegisterSuccess()
      }, 2000)
    } catch (err) {
      console.error('Registration error:', err)
      toast.error('Error during registration')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-8">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 mb-4 text-sm flex items-center gap-1 mx-auto">
              <Icon name="back" /> Subira ku rubuga rukuru
            </button>
            <Icon name="add" size="text-6xl" className="mx-auto mb-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Iyandikishe
            </h1>
            <p className="text-gray-600 mt-1">Narada Voting Committee 2026</p>
          </div>

          <form onSubmit={registerMember}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Icon name="phone" /> Numero ya Telefoni *
              </label>
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
              <p className="text-xs text-gray-500 mt-1">Shyiramo numero yawe ya telefoni (utagira 0 mbere)</p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Icon name="user" /> Izina Ryose *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Urugero: Jean Paul"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                <Icon name="email" /> Email (Bishobotse)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Ntabwo ari ngombwa, ariko uzakira amakuru</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Icon name="loading" spin={true} /> Birandikwa...</> : <><Icon name="add" /> Iyandikishe</>}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1"
            >
              <Icon name="back" /> Subira inyuma
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Icon name="lock" /> Uzabona kode yo kwinjira nyuma y'ukwemezwa
            </p>
          </div>
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default MemberRegister
