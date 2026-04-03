import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

import LandingPage from "./components/common/LandingPage";
import MemberLogin from "./components/auth/MemberLogin";
import MemberRegister from "./components/auth/MemberRegister";
import AdminLogin from "./components/auth/AdminLogin";
import MemberDashboard from "./components/member/MemberDashboard";
import Voting from "./components/voting/Voting";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem("narada_session");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setUser(session.user);
      setUserRole(session.user.role);
    }
    setLoading(false);
  }, []);

  const handleMemberLogin = (profile) => {
    setUser(profile);
    setUserRole(profile.role);
    toast.success(`Murakaza neza, ${profile.full_name || profile.phone}!`);
  };

  const handleAdminLogin = (profile) => {
    setUser(profile);
    setUserRole("admin");
    toast.success(`Murakaza neza, ${profile.full_name || "Admin"}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem("narada_session");
    setUser(null);
    setUserRole(null);
    toast.success("Wasohotse neza!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        {user && (
          <nav className="sticky top-0 z-50 bg-white shadow-lg">
            <div className="container px-4 mx-auto">
              <div className="flex items-center justify-between py-4">
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                    Narada Voting
                  </span>
                </Link>
                <div className="flex space-x-6">
                  <Link
                    to="/dashboard"
                    className="font-medium text-gray-700 transition hover:text-indigo-600"
                  >
                    Urubuga
                  </Link>
                  <Link
                    to="/vote"
                    className="font-medium text-gray-700 transition hover:text-indigo-600"
                  >
                    Gutora
                  </Link>
                  {userRole === "admin" && (
                    <Link
                      to="/admin"
                      className="font-medium text-gray-700 transition hover:text-indigo-600"
                    >
                      Ubuyobozi
                    </Link>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                    {userRole === "admin" ? " Ubuyobozi" : `✅ ${user.phone}`}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Sohoka
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/member-login"
            element={
              !user ? (
                <MemberLogin
                  onLogin={handleMemberLogin}
                  onShowRegister={() =>
                    (window.location.href = "/member-register")
                  }
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/member-register"
            element={
              !user ? (
                <MemberRegister
                  onBack={() => (window.location.href = "/member-login")}
                  onRegisterSuccess={() => {
                    toast.success(
                      "Iyandikishwa ryakozwe! Rindira ubuyobozi bukemeze konti yawe.",
                    );
                    window.location.href = "/member-login";
                  }}
                />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin-login"
            element={
              !user ? (
                <AdminLogin onLogin={handleAdminLogin} />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                userRole === "admin" ? (
                  <AdminPanel />
                ) : (
                  <MemberDashboard user={user} />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/vote"
            element={user ? <Voting user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/admin"
            element={
              user && userRole === "admin" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
