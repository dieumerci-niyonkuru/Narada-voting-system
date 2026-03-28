import React, { useState } from 'react'
import { supabase } from '../../utils/supabase'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import Icon from '../common/Icon'

function ReportsExport() {
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    setLoading(true)
    try {
      const { data: members } = await supabase
        .from('profiles')
        .select('phone, full_name, role, is_approved, approval_code, created_at')
        .order('created_at', { ascending: false })
      
      const { data: votes } = await supabase
        .from('votes')
        .select('*, candidates(name), positions(title)')
      
      const reportData = members?.filter(m => m.role !== 'admin').map(m => {
        const userVotes = votes?.filter(v => v.user_id === m.id) || []
        const votedInfo = userVotes.map(v => `${v.positions?.title}: ${v.candidates?.name}`).join(', ')
        
        return {
          'Telefoni': m.phone || 'N/A',
          'Izina': m.full_name || 'N/A',
          'Imiterere': m.is_approved ? 'Yemewe' : 'Itegereje',
          'Kode': m.approval_code || 'Ntayo',
          'Yatoye': userVotes.length > 0 ? 'Yego' : 'Oya',
          'Yatore': votedInfo || 'Ntayo',
          'Itariki': new Date(m.created_at).toLocaleDateString()
        }
      })
      
      const ws = XLSX.utils.json_to_sheet(reportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Abanyamuryango')
      XLSX.writeFile(wb, `narada_report_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Raporo yamanutse!')
    } catch (err) {
      toast.error('Error generating report')
    }
    setLoading(false)
  }

  const generateVotesReport = async () => {
    setLoading(true)
    try {
      const { data: positions } = await supabase.from('positions').select('*')
      const { data: candidates } = await supabase
        .from('candidates')
        .select('*, positions(title)')
        .order('vote_count', { ascending: false })
      
      const reportData = candidates?.map(c => ({
        'Umwanya': c.positions?.title || 'N/A',
        'Umukandida': c.name,
        'Amajwi': c.vote_count || 0,
        'Ibisobanuro': c.bio || 'N/A'
      }))
      
      const ws = XLSX.utils.json_to_sheet(reportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Amajwi')
      XLSX.writeFile(wb, `narada_votes_${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Raporo y\'amajwi yamanutse!')
    } catch (err) {
      toast.error('Error generating votes report')
    }
    setLoading(false)
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">í³Š Raporo</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Icon name="members" /> Abanyamuryango
          </h4>
          <button
            onClick={generateReport}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full flex items-center justify-center gap-2"
          >
            <Icon name="download" /> Kurekura Raporo
          </button>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Icon name="results" /> Amajwi
          </h4>
          <button
            onClick={generateVotesReport}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full flex items-center justify-center gap-2"
          >
            <Icon name="download" /> Kurekura Raporo
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportsExport
