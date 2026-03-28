import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center text-white mb-12">
          <div className="text-8xl mb-4 animate-bounce">���️</div>
          <h1 className="text-5xl font-bold mb-4">Narada Voting Committee 2026</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Secure, transparent, and fair elections for the Narada community
          </p>
        </div>

        {/* Two Big Login Buttons */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Member Login Button - Large and Attractive */}
            <Link to="/member-login" className="group">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8 text-white text-center">
                  <div className="text-7xl mb-4">���</div>
                  <h2 className="text-3xl font-bold mb-2">Member Login</h2>
                  <p className="text-green-100">Cast your vote securely</p>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500 text-xl">✓</span> Login with phone number
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500 text-xl">✓</span> Receive OTP code
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500 text-xl">✓</span> Vote securely
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500 text-xl">✓</span> View real-time results
                    </li>
                  </ul>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <span className="text-green-700 font-semibold">➡️ Click to Login</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Login Button - Large and Attractive */}
            <Link to="/admin-login" className="group">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white text-center">
                  <div className="text-7xl mb-4">���</div>
                  <h2 className="text-3xl font-bold mb-2">Admin Portal</h2>
                  <p className="text-purple-100">Manage the voting system</p>
                </div>
                <div className="p-6 bg-white">
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-500 text-xl">✓</span> Approve new members
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-500 text-xl">✓</span> Create voting sessions
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-500 text-xl">✓</span> Add candidates
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-500 text-xl">✓</span> Monitor results
                    </li>
                  </ul>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <span className="text-purple-700 font-semibold">➡️ Admin Access</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
              <div className="text-4xl mb-3">1️⃣</div>
              <h4 className="font-bold mb-2">Register</h4>
              <p className="text-sm text-indigo-100">New members register with phone number and name</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
              <div className="text-4xl mb-3">2️⃣</div>
              <h4 className="font-bold mb-2">Admin Approval</h4>
              <p className="text-sm text-indigo-100">Admin approves new members before voting</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
              <div className="text-4xl mb-3">3️⃣</div>
              <h4 className="font-bold mb-2">Vote</h4>
              <p className="text-sm text-indigo-100">Login with OTP and cast your vote</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white/60 text-sm">
          <p>© 2026 Narada Voting Committee. All rights reserved.</p>
          <p className="mt-1">Your voice matters - Vote responsibly</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
