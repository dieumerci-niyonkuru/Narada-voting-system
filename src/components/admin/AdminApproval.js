import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import Icon from '../common/Icon'

function AdminApproval() {
  const [pendingMembers, setPendingMembers] = useState([])
  const [approvedMembers, setApprovedMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const members = profiles?.filter(p => p.role !== 'admin') || []
    setPendingMembers(members.filter(p => !p.is_approved))
    setApprovedMembers(members.filter(p => p.is_approved))
    setLoading(false)
  }

  const approveMember = async (userId, phone, fullName) => {
    // Generate 8-character approval code
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let approvalCode = ''
    for (let i = 0; i < 8; i++) {
      approvalCode += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true, approval_code: approvalCode })
      .eq('id', userId)

    if (error) {
      toast.error('Error approving member')
    } else {
      alert(`‚úÖ MEMBER APPROVED!\n\nIzina: ${fullName || phone}\nTelefoni: +250 ${phone}\n\nÌ¥ë KODE YO KWINJIRA: ${approvalCode}\n\nIyi kode uyihe umunyamuryango kugirango yinjire.`)
      toast.success(`‚úì ${fullName || phone} yemejwe!`)
      fetchMembers()
    }
  }

  const deleteMember = async (userId, phone, fullName) => {
    if (window.confirm(`‚ö†Ô∏è GUSIBA ${fullName || phone}? Iki gikorwa ntigishobora guhindurwa!`)) {
      try {
        await supabase.from('votes').delete().eq('user_id', userId)
        const { error } = await supabase.from('profiles').delete().eq('id', userId)
        if (error) throw error
        toast.success(`Ì∑ëÔ∏è ${fullName || phone} yasibwe!`)
        fetchMembers()
      } catch (err) {
        toast.error('Error deleting member')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8"><Icon name="loading" spin={true} /> Loading...</div>
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-bold text-xl mb-4 text-yellow-700">‚è≥ Bategereje Kwemezwa ({pendingMembers.length})</h3>
        {pendingMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nta muntu utegereje</p>
        ) : (
          pendingMembers.map(m => (
            <div key={m.id} className="bg-white rounded-lg p-3 mb-2 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Ì≥± +250 {m.phone}</div>
                  <div className="text-sm text-gray-600">{m.full_name}</div>
                  <div className="text-xs text-gray-400">Yanditswe: {new Date(m.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveMember(m.id, m.phone, m.full_name)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">‚úì Emeza</button>
                  <button onClick={() => deleteMember(m.id, m.phone, m.full_name)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">‚úó Siba</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="bg-green-50 rounded-xl p-4">
        <h3 className="font-bold text-xl mb-4 text-green-700">‚úÖ Abemewe ({approvedMembers.length})</h3>
        {approvedMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nta munyamuryango wemewe</p>
        ) : (
          approvedMembers.map(m => (
            <div key={m.id} className="bg-white rounded-lg p-2 mb-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">Ì≥± +250 {m.phone}</div>
                <div className="text-sm text-gray-600">{m.full_name}</div>
              </div>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Kode: {m.approval_code}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminApproval
