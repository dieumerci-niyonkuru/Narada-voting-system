import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SocialFooter from '../common/SocialFooter'
import Icon from '../common/Icon'

function Voting({ user }) {
  const [publishedPosition, setPublishedPosition] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [votingLoading, setVotingLoading] = useState(false)
  const [votedCandidate, setVotedCandidate] = useState(null)
  const [votingActive, setVotingActive] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
    fetchVotingStatus()
  }, [])

  const fetchVotingStatus = async () => {
    const { data } = await supabase.from('voting_status').select('is_active').single()
    setVotingActive(data?.is_active !== false)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: position } = await supabase
        .from('positions')
        .select('*')
        .eq('is_published', true)
        .single()
      setPublishedPosition(position || null)
      
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
          .single()
        
        if (vote) {
          setHasVoted(true)
          const voted = candidatesData?.find(c => c.id === vote.candidate_id)
          setVotedCandidate(voted)
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    }
    setLoading(false)
  }

  const castVote = async (candidateId, candidateName) => {
    if (hasVoted) {
      toast.error('Uramaze gutora muri uyu mwanya!')
      return
    }

    if (!votingActive) {
      toast.error('Amatora yarahagaritswe! Rindira ubuyobozi.')
      return
    }

    if (!publishedPosition) {
      toast.error('Nta matora akomeje')
      return
    }

    const confirmVote = window.confirm(`Emeza ko ushaka gutora ${candidateName}? Iki gikorwa ntigishobora guhindurwa!`)
    if (!confirmVote) return

    setVotingLoading(true)
    
    try {
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          position_id: publishedPosition.id,
          candidate_id: candidateId,
          user_id: user.id
        })

      if (insertError) {
        toast.error('Error: ' + insertError.message)
        setVotingLoading(false)
        return
      }

      const currentCandidate = candidates.find(c => c.id === candidateId)
      const newVoteCount = (currentCandidate?.vote_count || 0) + 1
      
      await supabase
        .from('candidates')
        .update({ vote_count: newVoteCount })
        .eq('id', candidateId)
      
      setHasVoted(true)
      setVotedCandidate(currentCandidate)
      toast.success(`‚úì Watora: ${candidateName}! Amajwi yawe yanditswe.`)
      
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      toast.error('Error casting vote')
    }
    
    setVotingLoading(false)
  }

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

  if (!publishedPosition) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-6">
          <button onClick={() => navigate('/dashboard')} className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1">
            <Icon name="back" /> Subira ku rubuga
          </button>
          <div className="bg-yellow-50 rounded-xl p-8 text-center">
            <Icon name="info" size="text-5xl" className="mx-auto mb-3" />
            <h2 className="text-xl font-bold text-yellow-800 mb-2">Nta Matora Akomeje</h2>
            <p className="text-yellow-700">Rindira ubuyobozi gutangiza amatora</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Subira ku rubuga
            </button>
          </div>
        </div>
        <SocialFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-6">
        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center gap-1">
          <Icon name="back" /> Subira ku rubuga
        </button>

        <div className={`rounded-lg p-3 mb-5 text-center text-sm font-medium flex items-center justify-center gap-2 ${votingActive ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
          <Icon name={votingActive ? 'active' : 'inactive'} />
          {votingActive ? 'AMATORA AKOMEJE! Murashobora gutora.' : 'AMATORA YAHAGARITSWE! Rindira ubuyobozi.'}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Icon name="position" /> {publishedPosition.title}
            </h1>
            <p className="text-gray-600 mt-1">{publishedPosition.description}</p>
          </div>

          {hasVoted && votedCandidate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Icon name="success" size="text-2xl" />
                <div>
                  <p className="font-semibold text-green-800">Uramaze gutora!</p>
                  <p className="text-sm text-green-700">Watora: <strong>{votedCandidate.name}</strong></p>
                </div>
              </div>
            </div>
          )}

          {candidates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icon name="candidate" size="text-4xl" className="mx-auto mb-2" />
              <p>Nta bakandida bihari muri uyu mwanya</p>
              <p className="text-sm">Ubuyobozi buzakongeraho abakandida vuba</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map(candidate => {
                const totalVotes = candidates.reduce((sum, c) => sum + (c.vote_count || 0), 0)
                const percentage = totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(1) : 0
                const isLeader = candidate.vote_count === Math.max(...candidates.map(c => c.vote_count), 0) && candidate.vote_count > 0
                
                return (
                  <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="candidate" />
                          <h3 className="text-lg font-bold">{candidate.name}</h3>
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
                        onClick={() => castVote(candidate.id, candidate.name)}
                        disabled={hasVoted || votingLoading || !votingActive}
                        className={`ml-4 px-6 py-2 rounded-lg font-medium transition ${
                          hasVoted || !votingActive
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {votingLoading ? <Icon name="loading" spin={true} /> : 'Ì∑≥Ô∏è Tora'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default Voting
