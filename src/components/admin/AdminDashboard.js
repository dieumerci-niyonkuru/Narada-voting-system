import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    approvedMembers: 0,
    pendingMembers: 0,
    totalVotes: 0,
    totalSessions: 0,
    activeSessions: 0,
    totalCandidates: 0
  })
  const [candidatesData, setCandidatesData] = useState([])
  const [votingActive, setVotingActive] = useState(false)
  const [loading, setLoading] = useState(true)

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#06B6D4']

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      // Get voting status
      const { data: votingStatus } = await supabase.from('voting_status').select('is_active').single()
      setVotingActive(votingStatus?.is_active || false)

      // Get members stats
      const { data: profiles } = await supabase.from('profiles').select('role, is_approved')
      const members = profiles?.filter(p => p.role === 'member') || []
      const totalMembers = members.length
      const approvedMembers = members.filter(m => m.is_approved).length
      const pendingMembers = totalMembers - approvedMembers

      // Get votes count
      const { count: totalVotes } = await supabase.from('votes').select('*', { count: 'exact', head: true })

      // Get sessions stats
      const { data: sessions } = await supabase.from('voting_sessions').select('*')
      const totalSessions = sessions?.length || 0
      const activeSessions = sessions?.filter(s => s.is_active && new Date(s.end_date) > new Date()).length || 0

      // Get candidates with votes
      const { data: candidates } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .order('vote_count', { ascending: false })
        .limit(10)

      const totalCandidates = candidates?.length || 0
      const chartData = candidates?.map(c => ({
        name: c.name.length > 20 ? c.name.substring(0, 17) + '...' : c.name,
        votes: c.vote_count,
        position: c.positions?.title
      })) || []

      setStats({
        totalMembers,
        approvedMembers,
        pendingMembers,
        totalVotes: totalVotes || 0,
        totalSessions,
        activeSessions,
        totalCandidates
      })
      setCandidatesData(chartData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setLoading(false)
    }
  }

  const getColorByPercentage = (value, max) => {
    const percentage = (value / max) * 100
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-blue-500'
    if (percentage >= 25) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  const maxVotes = Math.max(...candidatesData.map(c => c.votes), 1)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Ì≥ä Ibyavuye mu Matora</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">Ì±•</div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalMembers}</div>
          <div className="text-xs text-gray-600">Abanyamuryango</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">‚úÖ</div>
          <div className="text-2xl font-bold text-green-700">{stats.approvedMembers}</div>
          <div className="text-xs text-gray-600">Abemewe</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">‚è≥</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pendingMembers}</div>
          <div className="text-xs text-gray-600">Bategereje</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">Ì∑≥Ô∏è</div>
          <div className="text-2xl font-bold text-purple-700">{stats.totalVotes}</div>
          <div className="text-xs text-gray-600">Amajwi yose</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">Ì≥ã</div>
          <div className="text-2xl font-bold text-indigo-700">{stats.totalSessions}</div>
          <div className="text-xs text-gray-600">Amatora yose</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">‚úÖ</div>
          <div className="text-2xl font-bold text-orange-700">{stats.activeSessions}</div>
          <div className="text-xs text-gray-600">Akomeje</div>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">Ì±§</div>
          <div className="text-2xl font-bold text-pink-700">{stats.totalCandidates}</div>
          <div className="text-xs text-gray-600">Abakandida</div>
        </div>
        <div className={`rounded-lg p-4 text-center ${votingActive ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className="text-3xl mb-2">{votingActive ? 'Ìø¢' : 'Ì¥¥'}</div>
          <div className={`text-xl font-bold ${votingActive ? 'text-green-700' : 'text-red-700'}`}>
            {votingActive ? 'Akomeje' : 'Yahagaritswe'}
          </div>
          <div className="text-xs text-gray-600">Imiterere</div>
        </div>
      </div>

      {/* Charts Section */}
      {candidatesData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3 text-center">Amajwi y'abakandida (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={candidatesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#6366F1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3 text-center">Ijanisha ry'amajwi (Pie Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={candidatesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {candidatesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Candidates Table with Color Bars */}
      {candidatesData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-3">Abakandida n'Amajwi yabo</h3>
          <div className="space-y-3">
            {candidatesData.map(candidate => {
              const percentage = (candidate.votes / maxVotes) * 100
              const barColor = getColorByPercentage(candidate.votes, maxVotes)
              return (
                <div key={candidate.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{candidate.name}</span>
                    <span className="text-indigo-600 font-bold">{candidate.votes} amajwi</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${barColor} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {candidatesData.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          <div className="text-5xl mb-3">Ì≥ä</div>
          <p>Nta makuru y'ibyavuye</p>
          <p className="text-sm">Abakandida bazagaragara hano nyuma yo gutora</p>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
