import React, { useState } from 'react';
import { Swords, Map as MapIcon, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Matchmaking() {
  const [queueState, setQueueState] = useState<'idle' | 'queuing' | 'found'>('idle');

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Ranked Matchmaking</h1>
        <p className="text-zinc-400 mt-2">Queue up for a 5v5 balanced match using Rusty's automated Elo system.</p>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col justify-center items-center">
        
        {queueState === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
              <Swords className="w-10 h-10 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">5v5 Ranked Defuse</h2>
              <p className="text-zinc-400 mb-8 max-w-sm mx-auto">Captains will be automatically selected based on Elo. Map veto phase will begin once 10 players join.</p>
            </div>
            
            <button 
              onClick={() => setQueueState('queuing')}
              className="px-12 py-4 bg-amber-500 text-black text-xl font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
            >
              Find Match
            </button>
          </motion.div>
        )}

        {queueState === 'queuing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Searching for players...</h2>
              <p className="text-amber-500 font-mono text-xl">4 / 10</p>
            </div>
            
            <button 
              onClick={() => setQueueState('idle')}
              className="px-8 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Cancel Queue
            </button>
            <div className="pt-8">
               <button onClick={() => setQueueState('found')} className="text-xs text-zinc-600 underline">Simulate Match Found</button>
            </div>
          </motion.div>
        )}

        {queueState === 'found' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 w-full">
             <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl inline-block mb-4">
                <h2 className="text-2xl font-bold text-emerald-500">Match Found!</h2>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-left">
                   <h3 className="text-amber-500 font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Team Alpha</h3>
                   <ul className="space-y-2 text-sm">
                      <li className="text-white font-medium">⭐ RustyKing (Capt)</li>
                      <li className="text-zinc-400">PlayerTwo</li>
                      <li className="text-zinc-400">SniperPro</li>
                      <li className="text-zinc-400">EntryFrag</li>
                      <li className="text-zinc-400">SupportMain</li>
                   </ul>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-left">
                   <h3 className="text-blue-500 font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Team Bravo</h3>
                   <ul className="space-y-2 text-sm">
                      <li className="text-white font-medium">⭐ AimBotV2 (Capt)</li>
                      <li className="text-zinc-400">SneakyBeaky</li>
                      <li className="text-zinc-400">ClutchGod</li>
                      <li className="text-zinc-400">RiflerOne</li>
                      <li className="text-zinc-400">NewGuy</li>
                   </ul>
                </div>
             </div>
             
             <div className="mt-8 p-4 bg-zinc-900 rounded-xl flex items-center justify-between border border-zinc-800">
                <div className="flex items-center gap-3">
                   <MapIcon className="w-6 h-6 text-zinc-500" />
                   <div className="text-left">
                      <p className="text-sm text-zinc-400">Map Veto Phase</p>
                      <p className="font-bold text-white">Waiting for Captains...</p>
                   </div>
                </div>
                <button onClick={() => setQueueState('idle')} className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-700">Leave Match</button>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import { Shield } from 'lucide-react';
