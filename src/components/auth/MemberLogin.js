import React, { useState } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SocialFooter from '../common/SocialFooter'
import Icon from '../common/Icon'

function MemberLogin({ onLogin, onShowRegister }) {
  const [phone, setPhone] = useState('')
  const [approvalCode, setApprovalCode] = useState('')
  const [step, setStep] = useState('phone')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) return cleaned
    return cleaned.slice(0, 10)
  }

  const checkMember = async (e) => {
    e.preventDefault()
    if (phone.length !== 10) {
      toast.error('Shyiramo numero ya telefoni y\'imyaka 10')
      return
    }

    setLoading(true)
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', phone)
      .single()

    if (error || !profile) {
      toast.error('âŒ Iyi numero ntibonetse. Iyandikishe mbere.')
      setLoading(false)
      return
    }

    if (!profile.is_approved) {
      toast.error('â³ Konti yawe irategereje kwemezwa. Uzabona kode nyuma y\'ukwemezwa.')
      setLoading(false)
      return
    }

    setStep('code')
    setLoading(false)
  }

  const verifyCode = async (e) => {
    e.preventDefault()
    if (approvalCode.length < 4) {
      toast.error('Shyiramo kode yawe')
      return
    }

    setLoading(true)
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('approval_code', approvalCode.toUpperCase())
        .single()

      if (error || !profile) {
        toast.error('âŒ Kode itemewe. Jya ubaza ubuyobozi.')
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

      toast.success(`í¾‰ Murakaza neza, ${profile.full_name || 'Munyameremeri'}!`)
      onLogin(profile)
    } catch (err) {
      console.error('Login error:', err)
      toast.error('Login failed. Please try again.')
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
            <Icon name="member" size="text-6xl" className="mx-auto mb-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Kwinjira nk'Umuryango
            </h1>
            <p className="text-gray-600 mt-1">Narada Voting Committee 2026</p>
          </div>

          {step === 'phone' && (
            <>
              <form onSubmit={checkMember}>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-medium flex items-center gap-2">
                    <Icon name="phone" /> Numero ya Telefoni
                  </label>
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
                  <p className="text-xs text-gray-500 mt-2">Shyiramo numero yawe ya telefoni (utagira 0 mbere)</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Icon name="loading" spin={true} /> Raragenzura...</> : <><Icon name="login" /> Komeza</>}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t text-center">
                <button
                  onClick={onShowRegister}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg flex items-center justify-center gap-2 w-full"
                >
                  <Icon name="add" /> Ntabwo uri mwemerwa? Iyandikishe
                </button>
              </div>
            </>
          )}

          {step === 'code' && (
            <form onSubmit={verifyCode}>
              <div className="mb-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center justify-center gap-2">
                  <Icon name="success" />
                  <p className="text-blue-700 text-sm">âœ“ Iyi numero yanditswe: +250 {phone}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium text-center flex items-center justify-center gap-2">
                  <Icon name="lock" /> Kode yo Kwinjira
                </label>
                <input
                  type="text"
                  value={approvalCode}
                  onChange={(e) => setApprovalCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                  placeholder="Urugero: A7B3K9M2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength="8"
                  autoFocus
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">Kode utanga ubuyobozi</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Icon name="loading" spin={true} /> Raragenzura...</> : <><Icon name="success" /> Kwinjira</>}
              </button>
              
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full mt-3 text-indigo-600 hover:text-indigo-800 text-sm flex items-center justify-center gap-1"
              >
                <Icon name="back" /> Subira inyuma
              </button>
            </form>
          )}
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default MemberLogin
