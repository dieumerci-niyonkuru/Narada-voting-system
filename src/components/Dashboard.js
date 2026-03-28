import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function Dashboard({ userRole, user }) {
  const [stats, setStats] = useState({ totalMembers: 0, onlineMembers: 0, totalCandidates: 0, activeSessions: 0 })
  const [activeSessions, setActiveSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Get total approved members
    const { data: members } = await supabase.from('profiles').select('id').eq('role', 'member').eq('is_approved', true)
    
    // Get online members (last 5 minutes)
    const fiveMinsAgo = new Date(Date.now() - 5 * 60000).toISOString()
    const { data: online } = await supabase.from('profiles').select('id').eq('role', 'member').gte('last_login', fiveMinsAgo)
    
    // Get total candidates
    const { count: candidatesCount } = await supabase.from('candidates').select('*', { count: 'exact', head: true })
    
    // Get active sessions
    const { data: sessions } = await supabase.from('voting_sessions').select('*').eq('is_active', true).gte('end_date', new Date().toISOString())
    
    setStats({
      totalMembers: members?.length || 0,
      onlineMembers: online?.length || 0,
      totalCandidates: candidatesCount || 0,
      activeSessions: sessions?.length || 0
    })
    setActiveSessions(sessions || [])
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Loading dashboard...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold">Welcome to Narada Voting Committee 2026</h1>
        <p className="text-indigo-100 mt-2">Your trusted platform for fair and transparent elections</p>
        {userRole === 'admin' && <div className="mt-3 inline-block bg-white/20 rounded-lg px-3 py-1 text-sm">Ì±ë Administrator Access</div>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6"><div className="text-3xl font-bold text-indigo-600">{stats.totalMembers}</div><div className="text-gray-500">Total Members</div></div>
        <div className="bg-white rounded-xl shadow p-6"><div className="text-3xl font-bold text-green-600">{stats.onlineMembers}</div><div className="text-gray-500">Online Now</div></div>
        <div className="bg-white rounded-xl shadow p-6"><div className="text-3xl font-bold text-purple-600">{stats.totalCandidates}</div><div className="text-gray-500">Candidates</div></div>
        <div className="bg-white rounded-xl shadow p-6"><div className="text-3xl font-bold text-orange-600">{stats.activeSessions}</div><div className="text-gray-500">Active Sessions</div></div>
      </div>

      {activeSessions.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Ì∑≥Ô∏è Active Voting Sessions</h2>
          {activeSessions.map(s => (
            <div key={s.id} className="border-b py-3">
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-600">Ends: {new Date(s.end_date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
