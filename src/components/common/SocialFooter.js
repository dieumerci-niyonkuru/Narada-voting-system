import React from "react";
import Icon from "./Icon";

function SocialFooter() {
  return (
    <footer className="mt-12 text-white bg-gray-900">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="voteButton" size="text-2xl" />
              <span className="font-bold">Narada Voting Committee 2026</span>
            </div>
          </div>

          <div className="flex gap-6">
            <a
              href="https://github.com/dieumerci-niyonkuru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition transform hover:text-white hover:scale-110"
            >
              <Icon name="github" size="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/dieu-merci-niyonkuru-7725b1363/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition transform hover:text-white hover:scale-110"
            >
              <Icon name="linkedin" size="text-xl" />
            </a>
            <a
              href="https://x.com/dieumercin21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition transform hover:text-white hover:scale-110"
            >
              <Icon name="twitter" size="text-xl" />
            </a>
          </div>
        </div>
        <div className="pt-4 mt-6 text-xs text-center text-gray-500 border-t border-gray-800">
          <p>© 2026 Narada Voting Committee. Amatora y'ikinyarwanda</p>
          <p className="mt-1">Yakozwe na Dieumerci Niyonkuru</p>
        </div>
      </div>
    </footer>
  );
}

export default SocialFooter;
