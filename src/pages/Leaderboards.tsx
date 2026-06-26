import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Link } from 'react-router';

export default function Leaderboards() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from local mock API
    fetch('/api/rusty/leaderboard')
      .then(res => res.json())
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        // Fallback mock data
        setPlayers([
          { accountId: '1', ign: 'RustyKing', elo: 2450, rank: 'Master', wins: 150, matchesPlayed: 200 },
          { accountId: '2', ign: 'AimBotV2', elo: 2300, rank: 'Diamond', wins: 120, matchesPlayed: 180 },
          { accountId: '3', ign: 'SneakyBeaky', elo: 2150, rank: 'Diamond', wins: 95, matchesPlayed: 150 },
          { accountId: '4', ign: 'RustyPlayer', elo: 1250, rank: 'Gold', wins: 45, matchesPlayed: 75 },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Global Leaderboard</h1>
          <p className="text-zinc-400 mt-1">Top ranked players in the Rusty FACEIT community</p>
        </div>
      </div>

      <div className="bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 text-sm font-medium text-zinc-400">
                <th className="p-4 pl-6 w-16 text-center">#</th>
                <th className="p-4">Player</th>
                <th className="p-4">Rank</th>
                <th className="p-4 text-right">Matches</th>
                <th className="p-4 text-right">Win %</th>
                <th className="p-4 pr-6 text-right">Elo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">Loading leaderboard...</td>
                </tr>
              ) : (
                players.map((p, i) => (
                  <tr key={p.accountId} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="p-4 pl-6 text-center">
                      <div className="flex justify-center items-center">
                        {i === 0 ? <Trophy className="w-5 h-5 text-yellow-400" /> :
                         i === 1 ? <Medal className="w-5 h-5 text-zinc-400" /> :
                         i === 2 ? <Award className="w-5 h-5 text-amber-600" /> :
                         <span className="text-zinc-500 font-medium">{i + 1}</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link to={`/profile/${p.ign}`} className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {p.ign}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-md bg-zinc-800 text-zinc-300 font-medium">
                        {p.rank}
                      </span>
                    </td>
                    <td className="p-4 text-right text-zinc-400">{p.matchesPlayed || '-'}</td>
                    <td className="p-4 text-right text-zinc-400">
                      {p.matchesPlayed ? ((p.wins / p.matchesPlayed) * 100).toFixed(1) + '%' : '-'}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className="font-bold text-amber-500">{p.elo}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
