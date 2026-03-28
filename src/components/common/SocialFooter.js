import React from 'react'
import Icon from './Icon'

function SocialFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="voteButton" size="text-2xl" />
              <span className="font-bold">Narada Voting Committee 2026</span>
            </div>
            <p className="text-gray-400 text-sm">Amatora y'ikinyarwanda, yizewe, kandi angana</p>
          </div>
          
          <div className="flex gap-6">
            <a href="https://github.com/dieumerci-niyonkuru" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition transform hover:scale-110">
              <Icon name="github" size="text-xl" />
            </a>
            <a href="https://www.linkedin.com/in/dieu-merci-niyonkuru-7725b1363/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition transform hover:scale-110">
              <Icon name="linkedin" size="text-xl" />
            </a>
            <a href="https://x.com/dieumercin21" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition transform hover:scale-110">
              <Icon name="twitter" size="text-xl" />
            </a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-6 pt-4 border-t border-gray-800">
          <p>© 2026 Narada Voting Committee. Amatora y'ikinyarwanda</p>
          <p className="mt-1">Yakozwe na Dieumerci Niyonkuru</p>
        </div>
      </div>
    </footer>
  )
}

export default SocialFooter
