import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import Icon from '../common/Icon'

function AdminApproval() {
  const [pendingMembers, setPendingMembers] = useState([])
  const [approvedMembers, setApprovedMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

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
      alert(`‚úÖ MEMBER APPROVED!\n\nIzina: ${fullName || phone}\nTelefoni: +250 ${phone}\n\nÌ¥ë KODE YO KWINJIRA: ${approvalCode}`)
      toast.success(`‚úì ${fullName || phone} yemejwe!`)
      fetchMembers()
    }
  }

  const deleteMember = async (userId, phone, fullName) => {
    if (window.confirm(`‚ö†Ô∏è GUSIBA ${fullName || phone}?\n\nIki gikorwa ntigishobora guhindurwa!\n\nBizasiba:\n- Konti ya member\n- Amajwi yose yatanze\n- Ibyanditswe byose`)) {
      setDeleting(true)
      try {
        // First delete all votes by this user
        const { error: voteError } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', userId)
        
        if (voteError) {
          console.error('Error deleting votes:', voteError)
        }
        
        // Then delete the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)
        
        if (profileError) {
          toast.error('Error deleting member: ' + profileError.message)
        } else {
          toast.success(`Ì∑ëÔ∏è ${fullName || phone} yasibwe!`)
          fetchMembers()
        }
      } catch (err) {
        console.error('Delete error:', err)
        toast.error('Error deleting member')
      }
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8"><Icon name="loading" spin={true} /> Loading...</div>
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Pending Members */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Icon name="pending" size="text-2xl" className="text-yellow-600" />
            <h3 className="font-bold text-xl text-yellow-700">Bategereje Kwemezwa</h3>
          </div>
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">{pendingMembers.length}</span>
        </div>
        {pendingMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">‚ú® Nta muntu utegereje</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {pendingMembers.map(m => (
              <div key={m.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-xl">Ì≥±</span> +250 {m.phone}
                    </div>
                    <div className="text-sm text-gray-600">{m.full_name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Yanditswe: {new Date(m.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveMember(m.id, m.phone, m.full_name)} 
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon name="approve" /> Emeza
                    </button>
                    <button 
                      onClick={() => deleteMember(m.id, m.phone, m.full_name)} 
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                    >
                      <Icon name="delete" /> Siba
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Members */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Icon name="approved" size="text-2xl" className="text-green-600" />
            <h3 className="font-bold text-xl text-green-700">Abemewe</h3>
          </div>
          <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold">{approvedMembers.length}</span>
        </div>
        {approvedMembers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Ì≥≠ Nta munyamuryango wemewe</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {approvedMembers.map(m => (
              <div key={m.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-xl">Ì≥±</span> +250 {m.phone}
                    </div>
                    <div className="text-sm text-gray-600">{m.full_name}</div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-mono font-bold">
                      Kode: {m.approval_code}
                    </div>
                    <button 
                      onClick={() => deleteMember(m.id, m.phone, m.full_name)} 
                      disabled={deleting}
                      className="text-red-600 hover:text-red-800 text-sm font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition flex items-center gap-1"
                      title="Siba umunyamuryango"
                    >
                      <Icon name="delete" /> Siba
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminApproval
