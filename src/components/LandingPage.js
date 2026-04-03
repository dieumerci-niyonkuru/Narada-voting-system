import React, { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      <div className="container px-4 py-12 mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold">
            Narada Voting Committee 2026
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-indigo-100">
            Secure, transparent, and fair elections for the Narada community
          </p>
        </div>

        {/* Two Big Login Buttons */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Member Login Button - Large and Attractive */}
            <Link to="/member-login" className="group">
              <div className="overflow-hidden transition-all duration-300 transform bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-105">
                <div className="p-8 text-center text-white bg-gradient-to-r from-green-500 to-teal-500">
                  <div className="mb-4 text-7xl">���</div>
                  <h2 className="mb-2 text-3xl font-bold">Member Login</h2>
                  <p className="text-green-100">Cast your vote securely</p>
                </div>
                <div className="p-6 bg-white">
                  <ul className="mb-4 space-y-3">
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-green-500">✓</span> Login
                      with phone number
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-green-500">✓</span> Receive
                      OTP code
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-green-500">✓</span> Vote
                      securely
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-green-500">✓</span> View
                      real-time results
                    </li>
                  </ul>
                  <div className="p-3 text-center rounded-lg bg-green-50">
                    <span className="font-semibold text-green-700">
                      ➡️ Click to Login
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Login Button - Large and Attractive */}
            <Link to="/admin-login" className="group">
              <div className="overflow-hidden transition-all duration-300 transform bg-white shadow-2xl cursor-pointer rounded-2xl hover:scale-105">
                <div className="p-8 text-center text-white bg-gradient-to-r from-purple-600 to-indigo-600">
                  <div className="mb-4 text-7xl">���</div>
                  <h2 className="mb-2 text-3xl font-bold">Admin Portal</h2>
                  <p className="text-purple-100">Manage the voting system</p>
                </div>
                <div className="p-6 bg-white">
                  <ul className="mb-4 space-y-3">
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-purple-500">✓</span> Approve
                      new members
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-purple-500">✓</span> Create
                      voting sessions
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-purple-500">✓</span> Add
                      candidates
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <span className="text-xl text-purple-500">✓</span> Monitor
                      results
                    </li>
                  </ul>
                  <div className="p-3 text-center rounded-lg bg-purple-50">
                    <span className="font-semibold text-purple-700">
                      ➡️ Admin Access
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 text-white">
          <h3 className="mb-8 text-2xl font-bold text-center">How It Works</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-white/10 backdrop-blur rounded-xl">
              <div className="mb-3 text-4xl">1️⃣</div>
              <h4 className="mb-2 font-bold">Register</h4>
              <p className="text-sm text-indigo-100">
                New members register with phone number and name
              </p>
            </div>
            <div className="p-6 text-center bg-white/10 backdrop-blur rounded-xl">
              <div className="mb-3 text-4xl">2️⃣</div>
              <h4 className="mb-2 font-bold">Admin Approval</h4>
              <p className="text-sm text-indigo-100">
                Admin approves new members before voting
              </p>
            </div>
            <div className="p-6 text-center bg-white/10 backdrop-blur rounded-xl">
              <div className="mb-3 text-4xl">3️⃣</div>
              <h4 className="mb-2 font-bold">Vote</h4>
              <p className="text-sm text-indigo-100">
                Login with OTP and cast your vote
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-sm text-center text-white/60">
          <p>© 2026 Narada Voting Committee. All rights reserved.</p>
          <p className="mt-1">Your voice matters - Vote responsibly</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
