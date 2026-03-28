import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SocialFooter from './common/SocialFooter'
import Icon from './common/Icon'
import AdminApproval from './admin/AdminApproval'
import PositionsManagement from './admin/PositionsManagement'
import ReportsExport from './admin/ReportsExport'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('approval')
  const [adminUser, setAdminUser] = useState(null)
  const [votingActive, setVotingActive] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const savedSession = localStorage.getItem('narada_session')
    if (savedSession) {
      const session = JSON.parse(savedSession)
      setAdminUser(session.user)
    }
    fetchVotingStatus()
    setLoading(false)
  }, [])

  const fetchVotingStatus = async () => {
    try {
      const { data } = await supabase.from('voting_status').select('is_active').single()
      setVotingActive(data?.is_active || false)
    } catch (err) {
      setVotingActive(false)
    }
  }

  const toggleVoting = async () => {
    try {
      const newStatus = !votingActive
      const { data: record } = await supabase.from('voting_status').select('id').single()
      await supabase.from('voting_status').update({ is_active: newStatus }).eq('id', record.id)
      setVotingActive(newStatus)
      toast.success(newStatus ? 'AMATORA YATANGIJE!' : 'AMATORA YAHAGARITSWE!')
    } catch (err) {
      toast.error('Error toggling voting')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'approval', name: 'Abanyamuryango', icon: 'members' },
    { id: 'positions', name: 'Imyanya', icon: 'positions' },
    { id: 'reports', name: 'Raporo', icon: 'reports' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="sticky top-0 z-20">
        <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/dashboard')} className="text-white/80 hover:text-white text-sm flex items-center gap-1">
                  <Icon name="back" /> Subira
                </button>
                <div className="h-6 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <Icon name="admin" size="text-xl" />
                  <div>
                    <h1 className="text-lg font-bold">Ubuyobozi</h1>
                    <p className="text-purple-200 text-xs">{adminUser?.full_name || 'Admin'}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleVoting}
                  className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                    votingActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <Icon name={votingActive ? 'stop' : 'start'} />
                  {votingActive ? 'Hagarika Amatora' : 'Tangiza Amatora'}
                </button>
                <button
                  onClick={() => navigate('/member-login')}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2"
                >
                  <Icon name="member" /> Kwinjira nk'Umuryango
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={tab.icon} />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-5">
          {activeTab === 'approval' && <AdminApproval />}
          {activeTab === 'positions' && <PositionsManagement />}
          {activeTab === 'reports' && <ReportsExport />}
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default AdminPanel
