import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('members')
  const [adminUser, setAdminUser] = useState(null)
  const [votingActive, setVotingActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendingMembers, setPendingMembers] = useState([])
  const [approvedMembers, setApprovedMembers] = useState([])
  const [positions, setPositions] = useState([])
  const [sessions, setSessions] = useState([])
  const [showPositionForm, setShowPositionForm] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [positionData, setPositionData] = useState({ title: '', description: '' })
  const [sessionData, setSessionData] = useState({ title: '', description: '', start_date: '', end_date: '' })

  useEffect(() => {
    const savedSession = localStorage.getItem('narada_session')
    if (savedSession) {
      const session = JSON.parse(savedSession)
      setAdminUser(session.user)
    }
    fetchAllData()
    fetchVotingStatus()
  }, [])

  const fetchAllData = async () => {
    // Fetch members
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const members = profiles?.filter(p => p.role !== 'admin') || []
    setPendingMembers(members.filter(p => !p.is_approved))
    setApprovedMembers(members.filter(p => p.is_approved))
    
    // Fetch positions
    const { data: posData } = await supabase.from('positions').select('*')
    setPositions(posData || [])
    
    // Fetch sessions
    const { data: sessionData } = await supabase.from('voting_sessions').select('*')
    setSessions(sessionData || [])
    
    setLoading(false)
  }

  const fetchVotingStatus = async () => {
    try {
      const { data } = await supabase.from('voting_status').select('is_active').maybeSingle()
      if (data) {
        setVotingActive(data.is_active)
      } else {
        await supabase.from('voting_status').insert({ is_active: false })
        setVotingActive(false)
      }
    } catch (err) {
      setVotingActive(false)
    }
  }

  const toggleVoting = async () => {
    try {
      const { data } = await supabase.from('voting_status').select('id').maybeSingle()
      if (data) {
        await supabase.from('voting_status').update({ is_active: !votingActive }).eq('id', data.id)
      } else {
        await supabase.from('voting_status').insert({ is_active: !votingActive })
      }
      setVotingActive(!votingActive)
      toast.success(`Voting ${!votingActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Error toggling voting')
    }
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
      alert(`‚úÖ MEMBER APPROVED!\n\nMember: ${fullName || phone}\nPhone: +250 ${phone}\n\nÌ¥ë LOGIN CODE: ${approvalCode}`)
      toast.success(`‚úì ${fullName || phone} approved!`)
      fetchAllData()
    }
  }

  const deleteMember = async (userId, phone, fullName) => {
    if (window.confirm(`‚ö†Ô∏è Delete ${fullName || phone}?`)) {
      await supabase.from('votes').delete().eq('user_id', userId)
      const { error } = await supabase.from('profiles').delete().eq('id', userId)
      if (error) toast.error('Error deleting member')
      else {
        toast.success(`Ì∑ëÔ∏è Member deleted`)
        fetchAllData()
      }
    }
  }

  const createPosition = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('positions').insert(positionData)
    if (error) toast.error('Error: ' + error.message)
    else {
      toast.success('‚úì Position created!')
      setShowPositionForm(false)
      setPositionData({ title: '', description: '' })
      fetchAllData()
    }
  }

  const deletePosition = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      const { error } = await supabase.from('positions').delete().eq('id', id)
      if (error) toast.error('Error deleting')
      else {
        toast.success('Position deleted')
        fetchAllData()
      }
    }
  }

  const createSession = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('voting_sessions').insert({
      ...sessionData,
      is_active: true
    })
    if (error) toast.error('Error: ' + error.message)
    else {
      toast.success('‚úì Session created!')
      setShowSessionForm(false)
      setSessionData({ title: '', description: '', start_date: '', end_date: '' })
      fetchAllData()
    }
  }

  const deleteSession = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      await supabase.from('votes').delete().eq('session_id', id)
      await supabase.from('candidates').delete().eq('session_id', id)
      const { error } = await supabase.from('voting_sessions').delete().eq('id', id)
      if (error) toast.error('Error deleting')
      else {
        toast.success('Session deleted')
        fetchAllData()
      }
    }
  }

  const generateReport = async () => {
    const { data: allMembers } = await supabase.from('profiles').select('phone, full_name, role, is_approved, approval_code, created_at')
    const reportData = allMembers?.map(m => ({
      'Phone': m.phone || 'N/A',
      'Name': m.full_name || 'N/A',
      'Role': m.role,
      'Status': m.is_approved ? 'Approved' : 'Pending',
      'Login Code': m.approval_code || 'Not yet',
      'Registered': new Date(m.created_at).toLocaleDateString()
    }))
    const ws = XLSX.utils.json_to_sheet(reportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Members')
    XLSX.writeFile(wb, `narada_members_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Report downloaded!')
  }

  if (loading) return <div className="text-center py-12">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-4xl">Ì±ë</span>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-200">Welcome, {adminUser?.full_name || 'Admin'}</p>
              </div>
            </div>
            <button onClick={toggleVoting} className={`px-5 py-2 rounded-xl font-semibold shadow-md ${votingActive ? 'bg-red-500' : 'bg-green-500'}`}>
              {votingActive ? 'Ì¥¥ Stop Voting' : 'Ìø¢ Start Voting'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {['members', 'positions', 'sessions', 'reports'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl font-semibold transition ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {tab === 'members' && 'Ì±• Members'}
                {tab === 'positions' && 'Ì≥ã Positions'}
                {tab === 'sessions' && 'Ì∑≥Ô∏è Sessions'}
                {tab === 'reports' && 'Ì≥Ñ Reports'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl mb-4 text-yellow-600">‚è≥ Pending ({pendingMembers.length})</h3>
                {pendingMembers.map(m => (
                  <div key={m.id} className="flex justify-between items-center p-3 border-b">
                    <div>
                      <div className="font-semibold">Ì≥± +250 {m.phone}</div>
                      <div className="text-sm">{m.full_name}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveMember(m.id, m.phone, m.full_name)} className="bg-green-600 text-white px-3 py-1 rounded-lg">Approve</button>
                      <button onClick={() => deleteMember(m.id, m.phone, m.full_name)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-xl mb-4 text-green-600">‚úÖ Approved ({approvedMembers.length})</h3>
                {approvedMembers.map(m => (
                  <div key={m.id} className="flex justify-between items-center p-3 border-b">
                    <div>
                      <div className="font-semibold">Ì≥± +250 {m.phone}</div>
                      <div className="text-sm">{m.full_name}</div>
                    </div>
                    <div className="text-xs font-mono bg-green-100 px-2 py-1 rounded">Code: {m.approval_code}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positions Tab */}
          {activeTab === 'positions' && (
            <div>
              <button onClick={() => setShowPositionForm(!showPositionForm)} className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4">+ Create Position</button>
              {showPositionForm && (
                <form onSubmit={createPosition} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <input type="text" placeholder="Title" value={positionData.title} onChange={e => setPositionData({...positionData, title: e.target.value})} className="w-full border rounded p-2 mb-2" required />
                  <textarea placeholder="Description" value={positionData.description} onChange={e => setPositionData({...positionData, description: e.target.value})} className="w-full border rounded p-2 mb-2" rows="2" />
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                </form>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {positions.map(p => (
                  <div key={p.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-purple-700">{p.title}</h3>
                      <button onClick={() => deletePosition(p.id, p.title)} className="text-red-600">Ì∑ëÔ∏è</button>
                    </div>
                    <p className="text-gray-600 text-sm">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div>
              <button onClick={() => setShowSessionForm(!showSessionForm)} className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4">+ Create Session</button>
              {showSessionForm && (
                <form onSubmit={createSession} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <input type="text" placeholder="Title" value={sessionData.title} onChange={e => setSessionData({...sessionData, title: e.target.value})} className="w-full border rounded p-2 mb-2" required />
                  <textarea placeholder="Description" value={sessionData.description} onChange={e => setSessionData({...sessionData, description: e.target.value})} className="w-full border rounded p-2 mb-2" rows="2" />
                  <input type="datetime-local" value={sessionData.start_date} onChange={e => setSessionData({...sessionData, start_date: e.target.value})} className="w-full border rounded p-2 mb-2" required />
                  <input type="datetime-local" value={sessionData.end_date} onChange={e => setSessionData({...sessionData, end_date: e.target.value})} className="w-full border rounded p-2 mb-2" required />
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                </form>
              )}
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{s.title}</h3>
                        <p className="text-sm text-gray-600">{s.description}</p>
                        <p className="text-xs text-gray-500">{new Date(s.start_date).toLocaleDateString()} ‚Üí {new Date(s.end_date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => deleteSession(s.id, s.title)} className="text-red-600">Ì∑ëÔ∏è</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <button onClick={generateReport} className="bg-green-600 text-white px-6 py-3 rounded-lg">Ì≥• Download Excel Report</button>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Report includes: All members, phone, name, status, login codes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
