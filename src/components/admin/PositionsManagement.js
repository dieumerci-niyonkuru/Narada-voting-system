import React, { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import Icon from '../common/Icon'

function PositionsManagement() {
  const [positions, setPositions] = useState([])
  const [publishedPosition, setPublishedPosition] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [candidateBio, setCandidateBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPositionTitle, setNewPositionTitle] = useState('')
  const [newPositionDesc, setNewPositionDesc] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: positionsData } = await supabase.from('positions').select('*')
    setPositions(positionsData || [])
    
    const { data: published } = await supabase
      .from('positions')
      .select('*')
      .eq('is_published', true)
      .single()
    setPublishedPosition(published || null)
    setLoading(false)
  }

  const createPosition = async () => {
    if (!newPositionTitle.trim()) {
      toast.error('Shyiramo izina ry\'umwanya')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('positions').insert({
      title: newPositionTitle,
      description: newPositionDesc,
      is_published: false
    })
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('âœ“ Umwanya washizweho!')
      setShowForm(false)
      setNewPositionTitle('')
      setNewPositionDesc('')
      fetchData()
    }
    setLoading(false)
  }

  const publishPosition = async (positionId, title) => {
    if (publishedPosition) {
      toast.error(`Hagarika ${publishedPosition.title} mbere yo gutangiza uwundi`)
      return
    }
    setLoading(true)
    const { error } = await supabase
      .from('positions')
      .update({ is_published: true })
      .eq('id', positionId)
    if (error) {
      toast.error('Error publishing position')
    } else {
      toast.success(`âœ“ ${title} yatangijwe! Abanyamuryango barashobora gutora.`)
      fetchData()
    }
    setLoading(false)
  }

  const stopPosition = async (positionId, title) => {
    setLoading(true)
    const { error } = await supabase
      .from('positions')
      .update({ is_published: false })
      .eq('id', positionId)
    if (error) {
      toast.error('Error stopping position')
    } else {
      toast.success(`âœ“ ${title} yarahagaritswe`)
      fetchData()
    }
    setLoading(false)
  }

  const deletePosition = async (id, title) => {
    if (window.confirm(`Gusiba umwanya "${title}"? Ibi zisiba n\'abakandida n\'amajwi yose.`)) {
      setLoading(true)
      await supabase.from('votes').delete().eq('position_id', id)
      await supabase.from('candidates').delete().eq('position_id', id)
      const { error } = await supabase.from('positions').delete().eq('id', id)
      if (error) {
        toast.error('Error deleting')
      } else {
        toast.success('Umwanya wasibwe')
        fetchData()
      }
      setLoading(false)
    }
  }

  const addCandidate = async () => {
    if (!publishedPosition) {
      toast.error('Nta mwanya watangijwe')
      return
    }
    if (!candidateName.trim()) {
      toast.error('Shyiramo izina ry\'umukandida')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('candidates').insert({
      position_id: publishedPosition.id,
      name: candidateName,
      bio: candidateBio,
      vote_count: 0
    })
    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('âœ“ Umukandida yongewe!')
      setCandidateName('')
      setCandidateBio('')
      fetchData()
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
        fetchData()
      }
      setLoading(false)
    }
  }

  const getCandidates = async () => {
    if (!publishedPosition) return []
    const { data } = await supabase
      .from('candidates')
      .select('*')
      .eq('position_id', publishedPosition.id)
      .order('vote_count', { ascending: false })
    return data || []
  }

  const [candidatesList, setCandidatesList] = useState([])
  useEffect(() => {
    if (publishedPosition) {
      supabase
        .from('candidates')
        .select('*')
        .eq('position_id', publishedPosition.id)
        .order('vote_count', { ascending: false })
        .then(({ data }) => setCandidatesList(data || []))
    }
  }, [publishedPosition])

  if (loading && positions.length === 0) {
    return <div className="text-center py-8"><Icon name="loading" spin={true} /> Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Create Position Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">í³‹ Gucunga Imyanya</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Icon name="add" /> Shyiramo Umwanya
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold mb-3">Umwanya Mushya</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Izina ry'Umwanya (Perezida, Umwanditsi, ...)"
              value={newPositionTitle}
              onChange={(e) => setNewPositionTitle(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
            <textarea
              placeholder="Ibisobanuro"
              value={newPositionDesc}
              onChange={(e) => setNewPositionDesc(e.target.value)}
              className="w-full border rounded-lg p-2"
              rows="2"
            />
            <div className="flex gap-2">
              <button onClick={createPosition} className="bg-green-600 text-white px-4 py-2 rounded-lg">Shyiramo</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Hagarika</button>
            </div>
          </div>
        </div>
      )}

      {/* Published Position Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Icon name="active" className="text-green-600" /> Amatora Akomeje
        </h3>
        {publishedPosition ? (
          <div>
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xl font-bold text-green-700">{publishedPosition.title}</h4>
                  <p className="text-gray-600 text-sm">{publishedPosition.description}</p>
                </div>
                <button
                  onClick={() => stopPosition(publishedPosition.id, publishedPosition.title)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  <Icon name="stop" /> Hagarika
                </button>
              </div>
            </div>

            {/* Add Candidate Form */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold mb-3">Ongeraho Umukandida</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Izina ry'Umukandida"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
                <textarea
                  placeholder="Ibisobanuro (Amateka, Impano, ...)"
                  value={candidateBio}
                  onChange={(e) => setCandidateBio(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  rows="2"
                />
                <button onClick={addCandidate} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Ongeraho Umukandida</button>
              </div>
            </div>

            {/* Candidates List */}
            {candidatesList.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">Abakandida</h4>
                <div className="space-y-2">
                  {candidatesList.map(c => (
                    <div key={c.id} className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.bio?.substring(0, 50)}</div>
                        <div className="text-xs text-indigo-600 mt-1">{c.vote_count} amajwi</div>
                      </div>
                      <button onClick={() => deleteCandidate(c.id, c.name)} className="text-red-500 hover:text-red-700">
                        <Icon name="delete" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nta matora akomeje. Hitamo umwanya utangize.</p>
        )}
      </div>

      {/* All Positions List */}
      <div>
        <h3 className="font-bold text-lg mb-3">Imyanya Yose</h3>
        <div className="space-y-2">
          {positions.filter(p => !p.is_published).map(pos => (
            <div key={pos.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <div className="font-semibold">{pos.title}</div>
                <div className="text-xs text-gray-500">{pos.description}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => publishPosition(pos.id, pos.title)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  <Icon name="start" /> Tangiza
                </button>
                <button
                  onClick={() => deletePosition(pos.id, pos.title)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon name="delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PositionsManagement
