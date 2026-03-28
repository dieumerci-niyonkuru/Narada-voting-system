import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import Icon from '../common/Icon'

function MemberReports({ user }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [positions, setPositions] = useState([])
  const [candidates, setCandidates] = useState([])
  const [userVotes, setUserVotes] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: positionsData } = await supabase.from('positions').select('*')
      const { data: candidatesData } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .order('vote_count', { ascending: false })
      
      const { data: votes } = await supabase
        .from('votes')
        .select('position_id, candidate_id')
        .eq('user_id', user.id)
      
      const votedMap = {}
      votes?.forEach(v => { votedMap[v.position_id] = v.candidate_id })
      
      setPositions(positionsData || [])
      setCandidates(candidatesData || [])
      setUserVotes(votedMap)
      
      // Calculate results per position
      const resultsData = positionsData?.map(pos => {
        const posCandidates = candidatesData?.filter(c => c.position_id === pos.id) || []
        const totalVotes = posCandidates.reduce((sum, c) => sum + (c.vote_count || 0), 0)
        const winner = posCandidates.length > 0 ? posCandidates.reduce((a, b) => (a.vote_count > b.vote_count ? a : b)) : null
        
        return {
          position: pos.title,
          description: pos.description,
          totalVotes,
          winner: winner?.name || 'Ntawatsinze',
          winnerVotes: winner?.vote_count || 0,
          winnerPercentage: totalVotes > 0 && winner ? ((winner.vote_count / totalVotes) * 100).toFixed(1) : 0,
          candidates: posCandidates.map(c => ({
            name: c.name,
            votes: c.vote_count,
            percentage: totalVotes > 0 ? ((c.vote_count / totalVotes) * 100).toFixed(1) : 0,
            isUserVote: votedMap[pos.id] === c.id
          }))
        }
      })
      
      setResults(resultsData || [])
    } catch (err) {
      console.error('Error fetching results:', err)
    }
    setLoading(false)
  }

  const downloadMyVoteReport = async () => {
    setLoading(true)
    try {
      const reportData = results.map(r => ({
        'Umwanya': r.position,
        'Ibisobanuro': r.description,
        'Amajwi Yose': r.totalVotes,
        'Uwatsinze': r.winner,
        'Amajwi y\'Uwatsinze': r.winnerVotes,
        'Ijanisha': `${r.winnerPercentage}%`,
        'Watora': r.candidates.find(c => c.isUserVote)?.name || 'Ntawatora',
        'Itariki': new Date().toLocaleDateString()
      }))
      
      const ws = XLSX.utils.json_to_sheet(reportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Amajwi Yanjye')
      XLSX.writeFile(wb, `narada_my_votes_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Raporo y\'amajwi yawe yamanutse!')
    } catch (err) {
      toast.error('Error generating report')
    }
    setLoading(false)
  }

  const downloadFullResultsReport = async () => {
    setLoading(true)
    try {
      const allData = []
      results.forEach(r => {
        r.candidates.forEach(c => {
          allData.push({
            'Umwanya': r.position,
            'Umukandida': c.name,
            'Amajwi': c.votes,
            'Ijanisha': `${c.percentage}%`,
            'Uwatora': c.isUserVote ? 'Wowe' : 'Undi'
          })
        })
      })
      
      const ws = XLSX.utils.json_to_sheet(allData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Ibyavuye')
      XLSX.writeFile(wb, `narada_full_results_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Raporo yuzuye yamanutse!')
    } catch (err) {
      toast.error('Error generating report')
    }
    setLoading(false)
  }

  const downloadMyVotesOnly = async () => {
    setLoading(true)
    try {
      const myVotes = results.map(r => {
        const myVote = r.candidates.find(c => c.isUserVote)
        return {
          'Umwanya': r.position,
          'Watora': myVote?.name || 'Ntawatora',
          'Itariki': new Date().toLocaleDateString()
        }
      }).filter(v => v.Watora !== 'Ntawatora')
      
      const ws = XLSX.utils.json_to_sheet(myVotes)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Amajwi Yanjye')
      XLSX.writeFile(wb, `narada_my_votes_only_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Raporo y\'amajwi yawe yamanutse!')
    } catch (err) {
      toast.error('Error generating report')
    }
    setLoading(false)
  }

  if (loading && results.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="loading" spin={true} size="text-3xl" className="mx-auto mb-2" />
        <p>Loading results...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="reports" /> Raporo z'Amajwi
      </h2>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Icon name="download" size="text-3xl" className="mx-auto mb-2 text-blue-600" />
          <h3 className="font-bold">Amajwi Yanjye</h3>
          <p className="text-xs text-gray-600 mb-2">Reba uko watoye</p>
          <button
            onClick={downloadMyVotesOnly}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 w-full"
          >
            Kurekura
          </button>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Icon name="results" size="text-3xl" className="mx-auto mb-2 text-green-600" />
          <h3 className="font-bold">Ibyavuye Yose</h3>
          <p className="text-xs text-gray-600 mb-2">Reba ibyavuye mu matora yose</p>
          <button
            onClick={downloadFullResultsReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 w-full"
          >
            Kurekura
          </button>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Icon name="chart" size="text-3xl" className="mx-auto mb-2 text-purple-600" />
          <h3 className="font-bold">Raporo Yuzuye</h3>
          <p className="text-xs text-gray-600 mb-2">Raporo ikubiyemo byose</p>
          <button
            onClick={downloadMyVoteReport}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 w-full"
          >
            Kurekura
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="font-bold mb-3">Ibyavuye mu Matora</h3>
        <div className="space-y-4">
          {results.map((r, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg text-purple-700">{r.position}</h4>
                  <p className="text-xs text-gray-500">{r.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-600">{r.totalVotes} amajwi</div>
                  <div className="text-xs text-gray-500">Uwatsinze: {r.winner}</div>
                </div>
              </div>
              <div className="space-y-2">
                {r.candidates.map((c, cIdx) => (
                  <div key={cIdx} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Icon name="candidate" />
                        <span className="font-medium">{c.name}</span>
                        {c.isUserVote && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Watora</span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-indigo-600 text-sm">{c.votes} amajwi</div>
                        <div className="text-xs text-gray-500">{c.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${c.isUserVote ? 'bg-green-500' : 'bg-indigo-600'}`}
                        style={{ width: `${c.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MemberReports
