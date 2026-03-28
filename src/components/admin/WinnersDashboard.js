import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

function WinnersDashboard() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWinners()
  }, [])

  const fetchWinners = async () => {
    setLoading(true)
    try {
      // Get all positions
      const { data: positions } = await supabase.from('positions').select('*')
      
      // Get all candidates with votes
      const { data: candidates } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .order('vote_count', { ascending: false })
      
      // Find winners per position
      const winnersList = []
      for (const position of positions) {
        const positionCandidates = candidates?.filter(c => c.position_id === position.id) || []
        if (positionCandidates.length > 0) {
          const sorted = [...positionCandidates].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
          const winner = sorted[0]
          const totalVotes = positionCandidates.reduce((sum, c) => sum + (c.vote_count || 0), 0)
          const winnerPercentage = totalVotes > 0 ? ((winner.vote_count / totalVotes) * 100).toFixed(1) : 0
          
          winnersList.push({
            position: position.title,
            winner: winner.name,
            votes: winner.vote_count || 0,
            percentage: winnerPercentage,
            totalCandidates: positionCandidates.length,
            allCandidates: positionCandidates.map(c => ({ name: c.name, votes: c.vote_count || 0 }))
          })
        }
      }
      setWinners(winnersList)
    } catch (err) {
      console.error('Error fetching winners:', err)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading winners...</div>
  }

  if (winners.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-5xl mb-3">í¿†</div>
        <p>Nta watsinze kuri ubu</p>
        <p className="text-sm">Abatsinze bazagaragara hanyuma y'amatora</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">í¿† Abatsinze mu Matora</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {winners.map((winner, index) => (
          <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">í¿†</span>
              <div>
                <h3 className="font-bold text-lg text-purple-700">{winner.position}</h3>
                <p className="text-sm text-gray-600">Uwatsinze</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-xl text-green-700">{winner.winner}</div>
                  <div className="text-sm text-gray-500">{winner.votes} amajwi ({winner.percentage}%)</div>
                </div>
                <div className="text-4xl">í±‘</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Abandi bakandida ({winner.totalCandidates - 1}):</p>
              <div className="space-y-1 mt-1">
                {winner.allCandidates.filter(c => c.name !== winner.winner).map((c, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{c.name}</span>
                    <span className="text-gray-500">{c.votes} amajwi</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WinnersDashboard
