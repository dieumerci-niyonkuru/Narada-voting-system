import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SocialFooter from '../common/SocialFooter'
import Icon from '../common/Icon'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function MemberDashboard({ user }) {
  const [stats, setStats] = useState({ 
    totalMembers: 0, 
    totalVoted: 0, 
    votingActive: true,
    onlineMembers: 0,
    activeSessions: 0
  })
  const [publishedPosition, setPublishedPosition] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [votedCandidate, setVotedCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const navigate = useNavigate()

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#06B6D4']

  useEffect(() => {
    fetchAllData()
    updateOnlineStatus()
    const interval = setInterval(() => {
      fetchVotesOnly()
      updateOnlineStatus()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const updateOnlineStatus = async () => {
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)
  }

  const getOnlineMembers = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString()
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'member')
      .gte('last_login', fiveMinutesAgo)
    return data?.length || 0
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const { data: votingStatus } = await supabase.from('voting_status').select('is_active').single()
      const votingActive = votingStatus?.is_active !== false
      
      // Get all approved members
      const { data: allMembers } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'member')
        .eq('is_approved', true)
      const totalMembers = allMembers?.length || 0
      
      // Get unique voters (count distinct user_id in votes)
      const { data: uniqueVoters } = await supabase
        .from('votes')
        .select('user_id')
      const uniqueUserIds = new Set()
      uniqueVoters?.forEach(v => uniqueUserIds.add(v.user_id))
      const totalVoted = Math.min(uniqueUserIds.size, totalMembers)
      
      // Get online members
      const onlineCount = await getOnlineMembers()
      
      // Get active sessions count
      const { data: sessions } = await supabase
        .from('positions')
        .select('id')
        .eq('is_published', true)
      
      // Get published position
      const { data: position } = await supabase
        .from('positions')
        .select('*')
        .eq('is_published', true)
        .maybeSingle()
      
      setPublishedPosition(position || null)
      
      // Get candidates for published position
      if (position) {
        const { data: candidatesData } = await supabase
          .from('candidates')
          .select('*')
          .eq('position_id', position.id)
          .order('vote_count', { ascending: false })
        setCandidates(candidatesData || [])
        
        const { data: vote } = await supabase
          .from('votes')
          .select('candidate_id')
          .eq('position_id', position.id)
          .eq('user_id', user.id)
          .maybeSingle()
        
        if (vote) {
          setHasVoted(true)
          const voted = candidatesData?.find(c => c.id === vote.candidate_id)
          setVotedCandidate(voted)
        } else {
          setHasVoted(false)
          setVotedCandidate(null)
        }
      }
      
      setStats({
        totalMembers: totalMembers,
        totalVoted: totalVoted,
        votingActive: votingActive,
        onlineMembers: onlineCount,
        activeSessions: sessions?.length || 0
      })
    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  const fetchVotesOnly = async () => {
    try {
      // Get unique voters
      const { data: uniqueVoters } = await supabase
        .from('votes')
        .select('user_id')
      const uniqueUserIds = new Set()
      uniqueVoters?.forEach(v => uniqueUserIds.add(v.user_id))
      const totalVoted = Math.min(uniqueUserIds.size, stats.totalMembers)
      
      // Get candidates with updated votes
      if (publishedPosition) {
        const { data: candidatesData } = await supabase
          .from('candidates')
          .select('*')
          .eq('position_id', publishedPosition.id)
          .order('vote_count', { ascending: false })
        setCandidates(candidatesData || [])
      }
      
      setStats(prev => ({
        ...prev,
        totalVoted: totalVoted
      }))
    } catch (err) {
      console.error('Error refreshing votes:', err)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchAllData()
    toast.success('Amakuru mashya yakuwe!')
    setRefreshing(false)
  }

  // Participation rate - NEVER exceeds 100%
  const participationRate = stats.totalMembers > 0 
    ? ((stats.totalVoted / stats.totalMembers) * 100).toFixed(1) 
    : 0

  const totalVotes = candidates.reduce((sum, c) => sum + (c.vote_count || 0), 0)

  const getPercentage = (voteCount) => {
    if (totalVotes === 0) return 0
    return ((voteCount / totalVotes) * 100).toFixed(1)
  }

  const chartData = candidates.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 12) + '...' : c.name,
    votes: c.vote_count
  }))

  const pieData = candidates.map(c => ({
    name: c.name.length > 15 ? c.name.substring(0, 12) + '...' : c.name,
    value: c.vote_count
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="loading" spin={true} size="text-3xl" className="mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (showReports) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-6">
          <button
            onClick={() => setShowReports(false)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1"
          >
            <Icon name="back" /> Subira ku rubuga
          </button>
          <MemberReports user={user} />
        </div>
        <SocialFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold">Murakaza neza, {user?.full_name || 'Munyameremeri'}!</h1>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <Icon name="phone" /> +250 {user?.phone}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReports(true)}
              className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-purple-600 flex items-center gap-1"
            >
              <Icon name="reports" /> Raporo
            </button>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1"
            >
              <Icon name="refresh" spin={refreshing} /> {refreshing ? 'Kuvugurura...' : 'Vugurura'}
            </button>
          </div>
        </div>

        <div className={`rounded-xl p-3 mb-6 text-center text-sm font-medium flex items-center justify-center gap-2 ${stats.votingActive ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          <Icon name={stats.votingActive ? 'active' : 'inactive'} />
          {stats.votingActive ? 'AMATORA AKOMEJE! Murashobora gutora.' : 'AMATORA YAHAGARITSWE! Rindira ubuyobozi.'}
        </div>

        {/* Statistics Cards - Correct Logic */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <Icon name="members" size="text-2xl" className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-indigo-600">{stats.totalMembers}</div>
            <div className="text-xs text-gray-500">Abanyamuryango</div>
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <Icon name="voteButton" size="text-2xl" className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-600">{stats.totalVoted}</div>
            <div className="text-xs text-gray-500">Abatoye</div>
            {stats.totalVoted > stats.totalMembers && (
              <div className="text-xs text-red-500 mt-1">⚠️ Error: Abatoye barenze</div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <Icon name="chart" size="text-2xl" className="mx-auto mb-1" />
            <div className="text-2xl font-bold text-orange-600">{participationRate}%</div>
            <div className="text-xs text-gray-500">Ubwitabire</div>
            {participationRate > 100 && (
              <div className="text-xs text-red-500 mt-1">⚠️ Error: Ijanisha rirenze 100%</div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <Icon name="online" size="text-2xl" className="mx-auto mb-1 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats.onlineMembers}</div>
            <div className="text-xs text-gray-500">Abari Kuri Siti</div>
          </div>
        </div>

        {/* Active Position Section */}
        {publishedPosition ? (
          <div className="bg-white rounded-xl shadow p-5 mb-6">
            <div className="border-b pb-3 mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Icon name="position" /> {publishedPosition.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{publishedPosition.description}</p>
              <div className="text-xs text-gray-500 mt-1">Amajwi yose: {totalVotes}</div>
            </div>

            {hasVoted && votedCandidate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
                <Icon name="success" />
                <p className="text-green-800 text-sm">Watora: <strong>{votedCandidate.name}</strong></p>
              </div>
            )}

            {candidates.length === 0 ? (
              <p className="text-gray-400 text-center py-4">Nta bakandida bihari muri uyu mwanya</p>
            ) : (
              <div className="space-y-4">
                {candidates.map(candidate => {
                  const percentage = getPercentage(candidate.vote_count)
                  const isLeader = candidate.vote_count === Math.max(...candidates.map(c => c.vote_count), 0) && candidate.vote_count > 0
                  
                  return (
                    <div key={candidate.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="candidate" />
                            <h3 className="font-bold text-lg">{candidate.name}</h3>
                            {isLeader && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Icon name="winners" /> Ayobora
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{candidate.bio}</p>
                          <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Amajwi: {candidate.vote_count}</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${isLeader ? 'bg-yellow-500' : 'bg-indigo-600'}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/vote')}
                          disabled={hasVoted || !stats.votingActive}
                          className={`ml-4 px-6 py-2 rounded-lg font-medium transition ${
                            hasVoted || !stats.votingActive
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {hasVoted ? 'Umaze Gutora' : 'Tora'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-xl p-6 mb-6 text-center">
            <Icon name="info" size="text-4xl" className="mx-auto mb-3" />
            <p className="text-yellow-800 font-medium">Nta matora akomeje kuri ubu</p>
            <p className="text-yellow-600 text-sm mt-1">Rindira ubuyobozi gutangiza amatora</p>
          </div>
        )}

        {/* Charts Section */}
        {candidates.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Icon name="results" /> Uko Amatora Agenda
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-2 text-center">Amajwi y'abakandida</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#6366F1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-sm mb-2 text-center">Ijanisha ry'amajwi</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {!stats.votingActive && (
          <div className="bg-red-50 rounded-xl p-3 border border-red-200 mb-4 flex items-center justify-center gap-2">
            <Icon name="inactive" />
            <p className="text-red-700 text-sm">Amatora yarahagaritswe. Rindira ubuyobozi gutangiza amatora!</p>
          </div>
        )}

        <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex items-center justify-center gap-2">
          <Icon name="lock" />
          <p className="text-green-800 text-xs">Amajwi yawe ni amwe kandi yibanga. Nta wundi uzamenya uwo utoye!</p>
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default MemberDashboard
