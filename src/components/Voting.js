import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

function Voting({ user }) {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [votingLoading, setVotingLoading] = useState(false)
  const [votedCandidate, setVotedCandidate] = useState(null)

  useEffect(() => {
    fetchActiveSessions()
  }, [])

  const fetchActiveSessions = async () => {
    const { data } = await supabase
      .from('voting_sessions')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
    setSessions(data || [])
  }

  const fetchCandidates = async (sessionId) => {
    setLoading(true)
    const { data } = await supabase
      .from('candidates')
      .select('*, positions(title)')
      .eq('session_id', sessionId)
      .order('vote_count', { ascending: false })
    setCandidates(data || [])
    
    // Check if user has already voted
    const { data: voteData } = await supabase
      .from('votes')
      .select('candidate_id')
      .eq('session_id', sessionId)
      .eq('user_id', user.id)
      .single()
    
    if (voteData) {
      setHasVoted(true)
      const votedCandidateData = data?.find(c => c.id === voteData.candidate_id)
      setVotedCandidate(votedCandidateData)
    } else {
      setHasVoted(false)
      setVotedCandidate(null)
    }
    setLoading(false)
  }

  const castVote = async (candidateId) => {
    if (hasVoted) {
      toast.error('You have already voted in this session')
      return
    }

    const confirmVote = window.confirm('Are you sure you want to cast your vote? This action cannot be undone.')
    if (!confirmVote) return

    setVotingLoading(true)
    
    const { error } = await supabase
      .from('votes')
      .insert({
        session_id: selectedSession.id,
        candidate_id: candidateId,
        user_id: user.id
      })

    if (error) {
      toast.error('Error casting vote: ' + error.message)
    } else {
      // Update vote count
      await supabase.rpc('increment_vote_count', { candidate_id_param: candidateId })
      setHasVoted(true)
      const votedCandidateData = candidates.find(c => c.id === candidateId)
      setVotedCandidate(votedCandidateData)
      toast.success('‚úì Your vote has been recorded successfully!')
      fetchCandidates(selectedSession.id)
    }
    setVotingLoading(false)
  }

  const isSessionExpired = (session) => {
    return new Date(session.end_date) < new Date()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Ì∑≥Ô∏è Voting Area</h1>
        <p className="text-gray-600 mt-1">Cast your vote for your preferred candidates</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>Ì≥ã</span> Active Sessions
            </h2>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">Ì≥≠</div>
                <p>No active voting sessions available.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map(session => {
                  const expired = isSessionExpired(session)
                  return (
                    <button
                      key={session.id}
                      onClick={() => !expired && fetchCandidates(session.id)}
                      disabled={expired}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedSession?.id === session.id
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'hover:bg-gray-100 border-2 border-transparent'
                      } ${expired ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-medium">{session.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ends: {new Date(session.end_date).toLocaleDateString()}
                      </div>
                      {expired && (
                        <div className="text-xs text-red-500 mt-1">‚è∞ Expired</div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedSession.title}</h2>
                {selectedSession.description && (
                  <p className="text-gray-600 mt-1">{selectedSession.description}</p>
                )}
                <div className="text-sm text-gray-500 mt-2">
                  Ì∑ìÔ∏è Ends: {new Date(selectedSession.end_date).toLocaleString()}
                </div>
              </div>
              
              {hasVoted && votedCandidate && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">‚úÖ</span>
                    <div>
                      <p className="font-semibold text-green-800">You have already voted!</p>
                      <p className="text-sm text-green-700">
                        You voted for: <strong>{votedCandidate.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading candidates...</div>
              ) : candidates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">Ì±•</div>
                  <p>No candidates found for this session.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {candidates.map(candidate => (
                    <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                      {candidate.image_url && (
                        <img 
                          src={candidate.image_url} 
                          alt={candidate.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                      <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
                      <p className="text-indigo-600 font-medium text-sm">{candidate.positions?.title || 'Candidate'}</p>
                      <p className="text-sm text-gray-500 mt-2">{candidate.bio}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Ì∑≥Ô∏è {candidate.vote_count} votes</span>
                        <button
                          onClick={() => castVote(candidate.id)}
                          disabled={hasVoted || votingLoading || isSessionExpired(selectedSession)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            hasVoted || isSessionExpired(selectedSession)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {votingLoading ? 'Voting...' : 'Vote'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
              <div className="text-6xl mb-4">Ì∑≥Ô∏è</div>
              <h3 className="text-xl font-semibold">Select a Voting Session</h3>
              <p className="mt-2">Choose an active session from the left to view candidates and cast your vote</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Voting
