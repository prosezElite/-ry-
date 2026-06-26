import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router';
import { Search, Trophy, Server, Shield, Brain, Swords, Activity, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Pages
import DashboardOverview from './pages/DashboardOverview';
import PlayerProfile from './pages/PlayerProfile';
import Leaderboards from './pages/Leaderboards';
import ServerStatus from './pages/ServerStatus';
import Matchmaking from './pages/Matchmaking';
import RustyAI from './pages/RustyAI';

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="flex h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-amber-500/30 overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ width: 260 }}
          animate={{ width: isSidebarOpen ? 260 : 80 }}
          className="h-full border-r border-zinc-800 bg-[#121212] flex flex-col relative z-20 shrink-0 transition-all duration-300"
        >
          <div className="h-20 flex items-center justify-center border-b border-zinc-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/20">
                <Shield className="w-6 h-6 text-black" />
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-bold text-white tracking-tight">
                  <span className="text-zinc-500">[ry]</span> Rusty
                </span>
              )}
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem to="/" icon={<Activity />} label="Overview" isOpen={isSidebarOpen} />
            <NavItem to="/profile/search" icon={<Search />} label="Find Player" isOpen={isSidebarOpen} />
            <NavItem to="/leaderboards" icon={<Trophy />} label="Leaderboards" isOpen={isSidebarOpen} />
            <NavItem to="/matchmaking" icon={<Swords />} label="Matchmaking" isOpen={isSidebarOpen} />
            <NavItem to="/servers" icon={<Server />} label="Server Status" isOpen={isSidebarOpen} />
            <div className="pt-4 mt-4 border-t border-zinc-800">
              <NavItem to="/ai" icon={<Brain className="text-amber-400" />} label="Rusty AI" isOpen={isSidebarOpen} />
            </div>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] relative">
          {/* Header */}
          <header className="h-20 border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center px-8 justify-between z-10 sticky top-0">
            <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
              FACEIT Dashboard
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-zinc-400">Systems Online</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageTransition><DashboardOverview /></PageTransition>} />
                <Route path="/profile/:idOrName" element={<PageTransition><PlayerProfile /></PageTransition>} />
                <Route path="/profile/search" element={<PageTransition><PlayerProfile mode="search" /></PageTransition>} />
                <Route path="/leaderboards" element={<PageTransition><Leaderboards /></PageTransition>} />
                <Route path="/servers" element={<PageTransition><ServerStatus /></PageTransition>} />
                <Route path="/matchmaking" element={<PageTransition><Matchmaking /></PageTransition>} />
                <Route path="/ai" element={<PageTransition><RustyAI /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Router>
  );
}

function NavItem({ to, icon, label, isOpen }: { to: string, icon: React.ReactNode, label: string, isOpen: boolean }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors group relative"
      title={!isOpen ? label : undefined}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="font-medium">{label}</span>}
    </Link>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="max-w-6xl mx-auto"
    >
      {children}
    </motion.div>
  );
}
