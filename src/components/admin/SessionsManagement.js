import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'

function SessionsManagement() {
  const [sessions, setSessions] = useState([])
  const [positions, setPositions] = useState([])
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showCandidateForm, setShowCandidateForm] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sessionData, setSessionData] = useState({ title: '', description: '', start_date: '', end_date: '' })
  const [candidateData, setCandidateData] = useState({ name: '', position_id: '', bio: '', image_url: '' })
  const [sessionCandidates, setSessionCandidates] = useState([])

  useEffect(() => {
    fetchData()
    fetchPositions()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: sessionsData } = await supabase.from('voting_sessions').select('*')
    setSessions(sessionsData || [])
    setLoading(false)
  }

  const fetchPositions = async () => {
    const { data } = await supabase.from('positions').select('*')
    setPositions(data || [])
  }

  const fetchSessionCandidates = async (sessionId) => {
    const { data } = await supabase
      .from('candidates')
      .select('*, positions(title)')
      .eq('session_id', sessionId)
    setSessionCandidates(data || [])
  }

  const createSession = async (e) => {
    e.preventDefault()
    
    const startDate = new Date(sessionData.start_date)
    const endDate = new Date(sessionData.end_date)
    
    if (endDate <= startDate) {
      toast.error('Itariki y\'imperuka igomba kuba nyuma y\'itariki y\'itangira')
      return
    }
    
    setLoading(true)
    const { error } = await supabase.from('voting_sessions').insert({
      title: sessionData.title,
      description: sessionData.description,
      start_date: sessionData.start_date,
      end_date: sessionData.end_date,
      is_active: true,
      status: new Date(sessionData.start_date) <= new Date() ? 'active' : 'upcoming'
    })
    
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('‚úì Amatora yashizweho!')
      setShowSessionForm(false)
      setSessionData({ title: '', description: '', start_date: '', end_date: '' })
      fetchData()
    }
    setLoading(false)
  }

  const deleteSession = async (id, title) => {
    if (window.confirm(`Gusiba amatora "${title}"? Ibi bizasiba n\'amajwi yose.`)) {
      setLoading(true)
      await supabase.from('votes').delete().eq('session_id', id)
      await supabase.from('candidates').delete().eq('session_id', id)
      const { error } = await supabase.from('voting_sessions').delete().eq('id', id)
      if (error) {
        toast.error('Error deleting')
      } else {
        toast.success('Amatora yasibwe')
        fetchData()
      }
      setLoading(false)
    }
  }

  const addCandidate = async (e) => {
    e.preventDefault()
    if (!selectedSession) {
      toast.error('Hitamo amatora mbere')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('candidates').insert({
      ...candidateData,
      session_id: selectedSession.id,
      vote_count: 0
    })
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('‚úì Umukandida yongewe!')
      setShowCandidateForm(false)
      setCandidateData({ name: '', position_id: '', bio: '', image_url: '' })
      fetchSessionCandidates(selectedSession.id)
    }
    setLoading(false)
  }

  const deleteCandidate = async (id, name) => {
    if (window.confirm(`Gusiba umukandida "${name}"?`)) {
      setLoading(true)
      await supabase.from('votes').delete().eq('candidate_id', id)
      const { error } = await supabase.from('candidates').delete().eq('id', id)
      if (error) {
        toast.error('Error deleting')
      } else {
        toast.success('Umukandida yasibwe')
        fetchSessionCandidates(selectedSession.id)
      }
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Ì∑≥Ô∏è Amatora</h2>
        <button
          onClick={() => setShowSessionForm(!showSessionForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          + Shyiramo Amatora
        </button>
      </div>

      {showSessionForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-bold mb-3">Shyiramo Amatora Mashya</h3>
          <form onSubmit={createSession} className="space-y-3">
            <input
              type="text"
              placeholder="Izina ry'Amatora"
              value={sessionData.title}
              onChange={e => setSessionData({...sessionData, title: e.target.value})}
              className="w-full border rounded-lg p-2"
              required
            />
            <textarea
              placeholder="Ibisobanuro"
              value={sessionData.description}
              onChange={e => setSessionData({...sessionData, description: e.target.value})}
              className="w-full border rounded-lg p-2"
              rows="2"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 block">Itariki Itangira</label>
                <input
                  type="datetime-local"
                  value={sessionData.start_date}
                  onChange={e => setSessionData({...sessionData, start_date: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block">Itariki Imperuka</label>
                <input
                  type="datetime-local"
                  value={sessionData.end_date}
                  onChange={e => setSessionData({...sessionData, end_date: e.target.value})}
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Shyiramo</button>
              <button type="button" onClick={() => setShowSessionForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Hagarika</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-indigo-700">{session.title}</h3>
                <p className="text-sm text-gray-600">{session.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Ì≥Ö Tangira: {new Date(session.start_date).toLocaleString()} | Imperuka: {new Date(session.end_date).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSession(session)
                    setShowCandidateForm(true)
                    fetchSessionCandidates(session.id)
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  + Ongeraho Abakandida
                </button>
                <button
                  onClick={() => deleteSession(session.id, session.title)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Ì∑ëÔ∏è Siba
                </button>
              </div>
            </div>

            {showCandidateForm && selectedSession?.id === session.id && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-bold mb-3">Ongeraho Umukandida muri {session.title}</h4>
                <form onSubmit={addCandidate} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Izina ry'Umukandida"
                    value={candidateData.name}
                    onChange={e => setCandidateData({...candidateData, name: e.target.value})}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                  <select
                    value={candidateData.position_id}
                    onChange={e => setCandidateData({...candidateData, position_id: e.target.value})}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Hitamo Umwanya</option>
                    {positions.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Ibisobanuro"
                    value={candidateData.bio}
                    onChange={e => setCandidateData({...candidateData, bio: e.target.value})}
                    className="w-full border rounded-lg p-2"
                    rows="2"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">Ongeraho</button>
                    <button type="button" onClick={() => setShowCandidateForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Hagarika</button>
                  </div>
                </form>
              </div>
            )}

            {sessionCandidates.length > 0 && selectedSession?.id === session.id && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Abakandida muri aya matora</h4>
                <div className="space-y-2">
                  {sessionCandidates.map(c => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.positions?.title}</div>
                      </div>
                      <button onClick={() => deleteCandidate(c.id, c.name)} className="text-red-500 text-sm">Siba</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-3">Ì∑≥Ô∏è</div>
          <p>Nta matora yashyizweho</p>
          <p className="text-sm">Kanda "Shyiramo Amatora" utangire</p>
        </div>
      )}
    </div>
  )
}

export default SessionsManagement
