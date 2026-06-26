import React from 'react';
import { Users, Activity, Trophy, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-zinc-400 mt-2">Welcome to the [ry] Rusty Critical Ops Hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Linked Accounts" value="1,248" icon={<Users className="text-blue-400" />} />
        <StatCard title="Active Matches" value="12" icon={<Activity className="text-emerald-400" />} />
        <StatCard title="Top Elo" value="2,450" icon={<Trophy className="text-amber-400" />} />
        <StatCard title="Servers Online" value="4/4" icon={<Shield className="text-indigo-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/profile/search" className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col items-center justify-center text-center gap-2">
              <SearchIcon className="w-6 h-6 text-zinc-400" />
              <span className="text-sm font-medium">Lookup Player</span>
            </Link>
            <Link to="/matchmaking" className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors flex flex-col items-center justify-center text-center gap-2 group">
              <SwordsIcon className="w-6 h-6 text-zinc-400 group-hover:text-amber-400 transition-colors" />
              <span className="text-sm font-medium">Queue Match</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
          <BrainIcon className="w-12 h-12 text-amber-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Rusty AI Intelligence</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-sm">
            Analyze match data, optimize your veto strategies, and predict opponent behavior using our HIGH Thinking Gemini integration.
          </p>
          <Link to="/ai" className="px-6 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Ask Rusty AI
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="p-3 bg-zinc-900 rounded-xl">
        {icon}
      </div>
    </div>
  );
}

// Simple icons re-exports for local use
import { Search as SearchIcon, Swords as SwordsIcon, Brain as BrainIcon } from 'lucide-react';
