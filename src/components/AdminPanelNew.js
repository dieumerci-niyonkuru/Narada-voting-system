import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'
import AdminApproval from './AdminApproval'

function AdminPanelNew() {
  const [activeTab, setActiveTab] = useState('sessions')
  const [sessions, setSessions] = useState([])
  const [positions, setPositions] = useState([])
  const [votingActive, setVotingActive] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showPositionForm, setShowPositionForm] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  })
  
  const [positionData, setPositionData] = useState({
    title: '',
    description: '',
    max_candidates: 10
  })
  
  const [candidateData, setCandidateData] = useState({
    name: '',
    position_id: '',
    bio: '',
    image_url: ''
  })

  useEffect(() => {
    fetchSessions()
    fetchPositions()
    fetchVotingStatus()
  }, [])

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('voting_sessions')
      .select('*')
      .order('created_at', { ascending: false })
    setSessions(data || [])
  }

  const fetchPositions = async () => {
    const { data } = await supabase
      .from('positions')
      .select('*')
      .order('created_at')
    setPositions(data || [])
  }

  const fetchVotingStatus = async () => {
    const { data } = await supabase
      .from('voting_status')
      .select('*')
      .single()
    setVotingActive(data?.is_active || false)
  }

  const toggleVoting = async () => {
    const { error } = await supabase
      .from('voting_status')
      .update({ is_active: !votingActive })
      .eq('id', (await supabase.from('voting_status').select('id').single()).data.id)
    
    if (error) {
      toast.error('Error toggling voting')
    } else {
      setVotingActive(!votingActive)
      toast.success(`Voting ${!votingActive ? 'activated' : 'deactivated'}`)
    }
  }

  const createPosition = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase
      .from('positions')
      .insert(positionData)
    
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('‚úì Position created!')
      setShowPositionForm(false)
      fetchPositions()
      setPositionData({ title: '', description: '', max_candidates: 10 })
    }
    setLoading(false)
  }

  const createSession = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase
      .from('voting_sessions')
      .insert({
        ...formData,
        created_by: (await supabase.auth.getUser()).data.user.id
      })
    
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('‚úì Session created!')
      setShowSessionForm(false)
      fetchSessions()
      setFormData({ title: '', description: '', start_date: '', end_date: '' })
    }
    setLoading(false)
  }

  const addCandidate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase
      .from('candidates')
      .insert({
        ...candidateData,
        session_id: selectedSession.id
      })
    
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('‚úì Candidate added!')
      fetchCandidates(selectedSession.id)
      setCandidateData({ name: '', position_id: '', bio: '', image_url: '' })
    }
    setLoading(false)
  }

  const fetchCandidates = async (sessionId) => {
    const { data } = await supabase
      .from('candidates')
      .select('*')
      .eq('session_id', sessionId)
    setCandidates(data || [])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 py-4">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 font-semibold transition ${activeTab === 'sessions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              Ì∑≥Ô∏è Voting Sessions
            </button>
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-4 py-2 font-semibold transition ${activeTab === 'positions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              Ì≥ã Positions
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`px-4 py-2 font-semibold transition ${activeTab === 'approval' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              Ì±• Member Approval
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`px-4 py-2 font-semibold transition ${activeTab === 'controls' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}
            >
              ‚öôÔ∏è Controls
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'sessions' && (
          <div>
            <button
              onClick={() => setShowSessionForm(!showSessionForm)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition mb-6"
            >
              {showSessionForm ? '‚àí Cancel' : '+ Create New Session'}
            </button>

            {showSessionForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Create Voting Session</h2>
                <form onSubmit={createSession}>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Session Title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border rounded-lg px-4 py-2"
                      rows="3"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="border rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="border rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Create Session
                  </button>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4">All Sessions</h3>
                {sessions.map(session => (
                  <div key={session.id} className="bg-white rounded-xl shadow p-4 mb-3 cursor-pointer hover:shadow-md" onClick={() => { setSelectedSession(session); fetchCandidates(session.id) }}>
                    <div className="font-bold">{session.title}</div>
                    <div className="text-sm text-gray-600">{new Date(session.start_date).toLocaleDateString()} ‚Üí {new Date(session.end_date).toLocaleDateString()}</div>
                    <div className={`text-xs mt-2 ${session.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                      {session.is_active ? '‚úì Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedSession && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Candidates for {selectedSession.title}</h3>
                  <div className="bg-white rounded-xl shadow p-4 mb-4">
                    <h4 className="font-semibold mb-3">Add Candidate</h4>
                    <form onSubmit={addCandidate}>
                      <input
                        type="text"
                        placeholder="Candidate Name"
                        value={candidateData.name}
                        onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2 mb-2"
                        required
                      />
                      <select
                        value={candidateData.position_id}
                        onChange={(e) => setCandidateData({...candidateData, position_id: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2 mb-2"
                      >
                        <option value="">Select Position</option>
                        {positions.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Bio"
                        value={candidateData.bio}
                        onChange={(e) => setCandidateData({...candidateData, bio: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2 mb-2"
                        rows="2"
                      />
                      <input
                        type="url"
                        placeholder="Photo URL"
                        value={candidateData.image_url}
                        onChange={(e) => setCandidateData({...candidateData, image_url: e.target.value})}
                        className="w-full border rounded-lg px-4 py-2 mb-2"
                      />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">Add Candidate</button>
                    </form>
                  </div>
                  {candidates.map(c => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-sm text-gray-600">Votes: {c.vote_count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            <button
              onClick={() => setShowPositionForm(!showPositionForm)}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition mb-6"
            >
              {showPositionForm ? '‚àí Cancel' : '+ Create Position'}
            </button>

            {showPositionForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <form onSubmit={createPosition}>
                  <input
                    type="text"
                    placeholder="Position Title (e.g., Chairperson, Secretary)"
                    value={positionData.title}
                    onChange={(e) => setPositionData({...positionData, title: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2 mb-3"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={positionData.description}
                    onChange={(e) => setPositionData({...positionData, description: e.target.value})}
                    className="w-full border rounded-lg px-4 py-2 mb-3"
                    rows="2"
                  />
                  <input
                    type="number"
                    placeholder="Max Candidates"
                    value={positionData.max_candidates}
                    onChange={(e) => setPositionData({...positionData, max_candidates: parseInt(e.target.value)})}
                    className="w-full border rounded-lg px-4 py-2 mb-3"
                  />
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">Create Position</button>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions.map(pos => (
                <div key={pos.id} className="bg-white rounded-xl shadow p-4">
                  <div className="font-bold text-lg text-purple-700">{pos.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{pos.description}</div>
                  <div className="text-xs text-gray-400 mt-2">Max: {pos.max_candidates} candidates</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'approval' && <AdminApproval />}

        {activeTab === 'controls' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Voting Controls</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold">Voting Status</div>
                <div className={`text-sm ${votingActive ? 'text-green-600' : 'text-red-600'}`}>
                  {votingActive ? '‚óè Active' : '‚óè Inactive'}
                </div>
              </div>
              <button
                onClick={toggleVoting}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition ${votingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {votingActive ? 'Stop Voting' : 'Start Voting'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanelNew
