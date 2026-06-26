import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Search, MapPin, Activity, Trophy, Target, Crosshair, Award } from 'lucide-react';

export default function PlayerProfile({ mode }: { mode?: 'search' }) {
  const { idOrName } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isSearchMode = mode === 'search' || !idOrName;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/profile/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (isSearchMode) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Player Lookup</h1>
          <p className="text-zinc-400">Search for a Rusty linked account or public C-OPS profile</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-[#121212] border border-zinc-800 rounded-2xl text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            placeholder="Enter IGN or Account ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 rounded-2xl bg-zinc-900 border-2 border-amber-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)] overflow-hidden">
            {/* Mock Avatar */}
            <span className="text-4xl font-bold text-amber-500">{idOrName.substring(0,2).toUpperCase()}</span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-white tracking-tight">{idOrName}</h1>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm font-semibold rounded-full">
                Gold
              </span>
            </div>
            <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2 mb-6">
              <span>Account ID: 12345678</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> EU</span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-zinc-500 mb-1">Current Elo</p>
                <p className="text-2xl font-bold text-amber-400">1,250</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-zinc-500 mb-1">Peak Elo</p>
                <p className="text-2xl font-bold text-white">1,300</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-zinc-500 mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-white">60.0%</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-sm text-zinc-500 mb-1">Matches</p>
                <p className="text-2xl font-bold text-white">75</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox icon={<Target />} label="Average K/D" value="1.45" />
        <StatBox icon={<Crosshair />} label="Average ADR" value="135.2" />
        <StatBox icon={<Award />} label="MVP Count" value="12" />
      </div>
      
      {/* Match History Mock */}
      <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Matches</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800/50">
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${i % 2 === 1 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                   {i % 2 === 1 ? 'W' : 'L'}
                 </div>
                 <div>
                   <p className="font-medium text-white">{i % 2 === 1 ? '13 - 10' : '11 - 13'}</p>
                   <p className="text-sm text-zinc-500">Plaza • 2 hours ago</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="font-medium text-white">K/D: 1.5</p>
                 <p className={`text-sm ${i % 2 === 1 ? 'text-emerald-500' : 'text-red-500'}`}>
                   {i % 2 === 1 ? '+25 Elo' : '-20 Elo'}
                 </p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
      <div className="p-4 bg-zinc-900 rounded-xl text-amber-500">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
