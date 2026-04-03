import React from "react";
import { Link } from "react-router-dom";
import SocialFooter from "./SocialFooter";
import Icon from "./Icon";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600">
      <div className="container px-4 py-12 mx-auto">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-32 rounded-2xl backdrop-blur">
              <img
                src="logo.webp"
                alt="narada-logo"
                className="object-cover w-full rounded-md"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Narada comittee Voting
              </h1>
            </div>
          </Link>
          <div className="flex gap-3">
            <a
              href="https://www.youtube.com/@naradachoircep"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-3 font-semibold text-gray-300 transition rounded-full bg-white/20 hover:bg-white/30 animate-pulse"
            >
              Youtube channel
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12 text-center text-white">
          <Icon name="vote" size="text-7xl" className="mb-6 animate-bounce" />
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            Narada Voting Committee {new Date().getFullYear()}
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-indigo-100">
            Amatora yizewe kandi yorohereza buri muririmbyi. Iyandikishe,
            emezwa, hanyuma utore umukandida wawe mu buryo bworoshye kandi
            bwihuse.
          </p>
        </div>

        {/* Two Main Buttons */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Member Button */}
            <Link to="/member-login" className="group">
              <div className="overflow-hidden transition-all duration-300 transform bg-white shadow-2xl rounded-2xl hover:scale-105">
                <div className="p-8 text-center text-white bg-gradient-to-r from-indigo-500 to-slate-600">
                  <Icon name="member" size="text-6xl" className="mb-4" />
                  <h2 className="mb-2 text-3xl font-bold">
                    Injira nk'umuririmbyi
                  </h2>
                  <p className="text-emerald-100">Member Login</p>
                </div>
                <div className="p-6 bg-white">
                  <div className="p-3 text-center rounded-lg bg-emerald-50">
                    <span className="flex items-center justify-center gap-2 font-semibold text-emerald-700">
                      <Icon name="login" /> Kanda hano winjire
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Button */}
            <Link to="/admin-login" className="group">
              <div className="overflow-hidden transition-all duration-300 transform bg-white shadow-2xl rounded-2xl hover:scale-105">
                <div className="p-8 text-center text-white bg-gradient-to-r from-gray-600 to-indigo-600">
                  <Icon name="admin" size="text-6xl" className="mb-4" />
                  <h2 className="mb-2 text-3xl font-bold">
                    Injira nk'Umuyobozi
                  </h2>
                  <p className="text-amber-100">Admin Portal</p>
                </div>
                <div className="p-6 bg-white">
                  <div className="p-3 text-center rounded-lg bg-amber-50">
                    <span className="flex items-center justify-center gap-2 font-semibold text-amber-700">
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
          <h3 className="mb-10 text-3xl font-bold text-center">Uko Bikora</h3>
          <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-3">
            <div className="p-6 text-center bg-white/10 backdrop-blur rounded-2xl">
              <Icon name="userPlus" size="text-4xl" className="mb-3" />
              <h4 className="mb-2 text-xl font-bold">Iyandikishe</h4>
              <p className="text-sm text-indigo-100">
                Iyandikishe ukoreshe numero ya telefoni
              </p>
            </div>
            <div className="p-6 text-center bg-white/10 backdrop-blur rounded-2xl">
              <Icon name="userCheck" size="text-4xl" className="mb-3" />
              <h4 className="mb-2 text-xl font-bold">Emeza</h4>
              <p className="text-sm text-indigo-100">
                Ubuyobozi bukemeze konti yawe
              </p>
            </div>
            <div className="p-6 text-center bg-white/10 backdrop-blur rounded-2xl">
              <Icon name="voteButton" size="text-4xl" className="mb-3" />
              <h4 className="mb-2 text-xl font-bold">Tora</h4>
              <p className="text-sm text-indigo-100">
                Injira ukoreshe kode utore umukandida wawe
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 mt-16 text-center border-t border-white/20">
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://github.com/dieumerci-niyonkuru"
              target="_blank"
              rel="noopener noreferrer"
              className="transition text-white/60 hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/dieu-merci-niyonkuru-7725b1363/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition text-white/60 hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/dieumercin21"
              target="_blank"
              rel="noopener noreferrer"
              className="transition text-white/60 hover:text-white"
            >
              X (Twitter)
            </a>
          </div>
          <p className="text-sm text-white/40">
            ©Allright reserved. 2026 Narada Voting Committee.
          </p>
        </div>
      </div>
      <SocialFooter />
    </div>
  );
}

export default LandingPage;
