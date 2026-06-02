import { Link } from "@tanstack/react-router";
import { FiGithub, FiExternalLink, FiBookOpen, FiCode } from "react-icons/fi";
import {
  FiHome,
  FiBarChart2,
  FiMap,
  FiCpu,
  FiUsers,
  FiDatabase,
  FiSend,
} from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground/90 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-ocean flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-display font-bold text-xl text-white">NEXUS</span>
          </div>
          <p className="text-sm text-white/70 max-w-md leading-relaxed">
            Connecting Pacific Agriculture, Climate, and Data. Built for the
            Pacific Dataviz Challenge 2026.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <FiGithub className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="inline-flex items-center gap-2 hover:text-white"><FiHome className="w-3.5 h-3.5" />Home</Link></li>
            <li><Link to="/explorer" className="inline-flex items-center gap-2 hover:text-white"><FiBarChart2 className="w-3.5 h-3.5" />Explorer</Link></li>
            <li><Link to="/map" className="inline-flex items-center gap-2 hover:text-white"><FiMap className="w-3.5 h-3.5" />Pacific Map</Link></li>
            <li><Link to="/ai" className="inline-flex items-center gap-2 hover:text-white"><FiCpu className="w-3.5 h-3.5" />Nexus AI</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Project</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" hash="team" className="inline-flex items-center gap-2 hover:text-white"><FiUsers className="w-3.5 h-3.5" />Team</Link></li>
            <li><Link to="/" hash="sources" className="inline-flex items-center gap-2 hover:text-white"><FiDatabase className="w-3.5 h-3.5" />Data Sources</Link></li>
            <li><a href="#" className="inline-flex items-center gap-2 hover:text-white"><FiGithub className="w-3.5 h-3.5" />GitHub</a></li>
            <li><a href="#" className="inline-flex items-center gap-2 hover:text-white"><FiSend className="w-3.5 h-3.5" />Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a
                href="https://pacificdatavizchallenge.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                Pacific Dataviz Challenge
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              <a href="#" className="inline-flex items-center gap-2 hover:text-white">
                <FiBookOpen className="w-3.5 h-3.5" />
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="inline-flex items-center gap-2 hover:text-white">
                <FiCode className="w-3.5 h-3.5" />
                API Reference
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/50">
          <p>© 2026 Team Nexus · Pacific Dataviz Challenge 2026</p>
          <p>Built with data, design, and a love for the Pacific.</p>
        </div>
      </div>
    </footer>
  );
}
