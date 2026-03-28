import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

function AdminApproval() {
  const [pendingUsers, setPendingUsers] = useState([])
  const [approvedUsers, setApprovedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    setPendingUsers(data?.filter(u => !u.is_approved) || [])
    setApprovedUsers(data?.filter(u => u.is_approved) || [])
    setLoading(false)
  }

  const approveUser = async (userId, phone) => {
    const approvalCode = Math.floor(10000000 + Math.random() * 90000000).toString()
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_approved: true, 
        approval_code: approvalCode 
      })
      .eq('id', userId)

    if (error) {
      toast.error('Error approving user')
    } else {
      toast.success(`âœ“ User approved! Code: ${approvalCode}`)
      console.log(`Approval code for ${phone}: ${approvalCode}`)
      fetchUsers()
    }
  }

  const rejectUser = async (userId) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) {
      toast.error('Error rejecting user')
    } else {
      toast.success('User rejected and removed')
      fetchUsers()
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Member Approval</h2>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-yellow-800">Pending Approval ({pendingUsers.length})</h3>
          </div>
          {pendingUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              No pending approvals
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <div key={user.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">í³± +250 {user.phone}</div>
                      <div className="text-sm text-gray-500">Email: {user.email || 'Not provided'}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Registered: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveUser(user.id, user.phone)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        âœ“ Approve
                      </button>
                      <button
                        onClick={() => rejectUser(user.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        âœ— Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-green-800">Approved Members ({approvedUsers.length})</h3>
          </div>
          {approvedUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              No approved members yet
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {approvedUsers.map(user => (
                <div key={user.id} className="bg-white rounded-xl shadow p-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium">í³± +250 {user.phone}</div>
                    <div className="text-xs text-green-600">âœ“ Approved</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Code: {user.approval_code}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminApproval
