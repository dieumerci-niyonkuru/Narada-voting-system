import React from 'react'
import { Link } from 'react-router-dom'
import SocialFooter from './SocialFooter'
import Icon from './Icon'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
              <Icon name="vote" size="text-2xl" className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Narada Voting</h1>
              <p className="text-indigo-200 text-sm">Komite 2026</p>
            </div>
          </Link>
          <div className="flex gap-3">
            <a href="https://github.com/dieumerci-niyonkuru" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <Icon name="github" className="text-white" />
            </a>
            <a href="https://www.linkedin.com/in/dieu-merci-niyonkuru-7725b1363/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <Icon name="linkedin" className="text-white" />
            </a>
            <a href="https://x.com/dieumercin21" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
              <Icon name="twitter" className="text-white" />
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center text-white mb-12">
          <Icon name="vote" size="text-7xl" className="mb-6 animate-bounce" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Narada Voting Committee 2026</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Amatora yizewe kandi yorohereza buri munyarwanda. Iyandikishe, emezwa, hanyuma utore umukandida wawe mu buryo bworoshye kandi bwihuse.
          </p>
        </div>

        {/* Two Main Buttons */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Member Button */}
            <Link to="/member-login" className="group">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
                  <Icon name="member" size="text-6xl" className="mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Injira nk'Umuryango</h2>
                  <p className="text-emerald-100">Member Login</p>
                </div>
                <div className="p-6 bg-white">
                  <div className="bg-emerald-50 rounded-lg p-3 text-center">
                    <span className="text-emerald-700 font-semibold flex items-center justify-center gap-2">
                      <Icon name="login" /> Kanda hano winjire
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Button */}
            <Link to="/admin-login" className="group">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white text-center">
                  <Icon name="admin" size="text-6xl" className="mb-4" />
                  <h2 className="text-3xl font-bold mb-2">Injira nk'Ubuyobozi</h2>
                  <p className="text-amber-100">Admin Portal</p>
                </div>
                <div className="p-6 bg-white">
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <span className="text-amber-700 font-semibold flex items-center justify-center gap-2">
                      <Icon name="admin" /> Kanda hano winjire
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 text-white">
          <h3 className="text-3xl font-bold text-center mb-10">Uko Bikora</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <Icon name="userPlus" size="text-4xl" className="mb-3" />
              <h4 className="text-xl font-bold mb-2">Iyandikishe</h4>
              <p className="text-indigo-100 text-sm">Iyandikishe ukoreshe numero ya telefoni</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <Icon name="userCheck" size="text-4xl" className="mb-3" />
              <h4 className="text-xl font-bold mb-2">Emeza</h4>
              <p className="text-indigo-100 text-sm">Ubuyobozi bukemeze konti yawe</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-2xl">
              <Icon name="voteButton" size="text-4xl" className="mb-3" />
              <h4 className="text-xl font-bold mb-2">Tora</h4>
              <p className="text-indigo-100 text-sm">Injira ukoreshe kode utore umukandida wawe</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://github.com/dieumerci-niyonkuru" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">GitHub</a>
            <a href="https://www.linkedin.com/in/dieu-merci-niyonkuru-7725b1363/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">LinkedIn</a>
            <a href="https://x.com/dieumercin21" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition">X (Twitter)</a>
          </div>
          <p className="text-white/40 text-sm">© 2026 Narada Voting Committee. Amatora y'ikinyarwanda</p>
          <p className="text-white/30 text-xs mt-2">Developed by Dieumerci Niyonkuru</p>
        </div>
      </div>
      <SocialFooter />
    </div>
  )
}

export default LandingPage
