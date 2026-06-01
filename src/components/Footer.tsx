import { Link } from "@tanstack/react-router";
import { Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-primary-foreground/90 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
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
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/explorer" className="hover:text-white">Explorer</Link></li>
            <li><Link to="/map" className="hover:text-white">Pacific Map</Link></li>
            <li><Link to="/ai" className="hover:text-white">Nexus AI</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Project</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/" hash="#team" className="hover:text-white">Team</Link></li>
            <li><Link to="/" hash="#sources" className="hover:text-white">Data Sources</Link></li>
            <li><a href="#" className="hover:text-white">GitHub</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
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
