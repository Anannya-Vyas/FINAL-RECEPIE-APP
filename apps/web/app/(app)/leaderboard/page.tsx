'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/api';

interface LeaderEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  country?: string;
  recipeCount: number;
  ratingCount: number;
  points: number;
}

const CHALLENGES = [
  { id: 1, title: 'The Risotto Master', points: 500, description: 'Cook 3 different types of risotto this week.', progress: 0, icon: '🍚' },
  { id: 2, title: 'Global Explorer', points: 1000, description: 'Try recipes from 5 different continents.', progress: 0, icon: '🌍' },
  { id: 3, title: 'Early Bird', points: 300, description: 'Prepare a healthy breakfast 5 days in a row.', progress: 0, icon: '🌅' },
  { id: 4, title: 'Community Star', points: 750, description: 'Share 2 recipes and get 50 likes.', progress: 0, icon: '⭐' },
  { id: 5, title: 'Spice Adventurer', points: 400, description: 'Cook with 10 different spices this month.', progress: 0, icon: '🌶️' },
  { id: 6, title: 'Heritage Keeper', points: 600, description: 'Add 3 family/grandmother recipes to the archive.', progress: 0, icon: '👵' },
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'recipes' | 'ratings'>('recipes');

  useEffect(() => {
    // Fetch real leaderboard data from the API
    api.get('/api/profile/leaderboard').then(({ data }) => {
      setLeaders(data.leaders || []);
    }).catch(() => {
      // Fallback: fetch top recipe contributors
      api.get('/api/recipes', { params: { limit: 20 } }).then(({ data }) => {
        // Build leaderboard from recipe authors
        const authorMap = new Map<string, { count: number; name: string }>();
        (data.recipes || []).forEach((r: { authorId?: string; author_id?: string }) => {
          const id = r.authorId || r.author_id || 'unknown';
          const existing = authorMap.get(id);
          authorMap.set(id, { count: (existing?.count || 0) + 1, name: existing?.name || `Chef ${id.slice(0, 6)}` });
        });
        const sorted = Array.from(authorMap.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 10)
          .map(([userId, data], i) => ({
            rank: i + 1,
            userId,
            displayName: data.name,
            recipeCount: data.count,
            ratingCount: 0,
            points: data.count * 100,
          }));
        setLeaders(sorted);
      }).catch(() => {});
    }).finally(() => setLoading(false));
  }, []);

  const sorted = [...leaders].sort((a, b) => category === 'recipes' ? b.recipeCount - a.recipeCount : b.ratingCount - a.ratingCount);

  return (
    <div className="max-w-screen-xl mx-auto">
      <section className="mb-10">
        <span className="font-label text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Community Rankings</span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Leaderboard</h1>
        <p className="text-on-surface-variant mt-2 max-w-xl">Real rankings based on real contributions. Rankings update as users add recipes and engage with the community.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex gap-2 bg-surface-container rounded-xl p-1.5 w-fit">
            {[{ id: 'recipes', label: '🍳 Most Recipes' }, { id: 'ratings', label: '⭐ Most Ratings' }].map(c => (
              <button key={c.id} onClick={() => setCategory(c.id as typeof category)} className={`px-5 py-2 rounded-lg font-label font-bold text-sm transition-all ${category === c.id ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 bg-surface-container rounded-2xl">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="font-headline text-xl font-bold text-on-surface">No rankings yet</h3>
              <p className="text-on-surface-variant text-sm mt-2">Be the first to add a recipe and claim the top spot!</p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {sorted.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center pt-8">
                    <div className="text-4xl mb-2">👤</div>
                    <div className="w-full bg-surface-container rounded-t-2xl p-4 text-center">
                      <p className="text-2xl mb-1">🥈</p>
                      <p className="font-headline font-bold text-sm text-on-surface truncate">{sorted[1]?.displayName}</p>
                      <p className="font-headline font-bold text-primary mt-1">{sorted[1]?.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl mb-2">👤</div>
                    <div className="w-full bg-gradient-to-b from-tertiary-fixed to-surface-container rounded-t-2xl p-4 text-center shadow-lg">
                      <p className="text-3xl mb-1">🥇</p>
                      <p className="font-headline font-bold text-sm text-on-surface truncate">{sorted[0]?.displayName}</p>
                      <p className="font-headline font-bold text-primary mt-1">{sorted[0]?.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center pt-12">
                    <div className="text-3xl mb-2">👤</div>
                    <div className="w-full bg-surface-container-high rounded-t-2xl p-4 text-center">
                      <p className="text-xl mb-1">🥉</p>
                      <p className="font-headline font-bold text-sm text-on-surface truncate">{sorted[2]?.displayName}</p>
                      <p className="font-headline font-bold text-primary mt-1">{sorted[2]?.points.toLocaleString()} pts</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-surface-container-lowest rounded-2xl border border-outline/10 overflow-hidden shadow-sm">
                {sorted.map((leader, i) => (
                  <div key={leader.userId} className={`flex items-center gap-4 p-4 ${i < sorted.length - 1 ? 'border-b border-outline/10' : ''} hover:bg-surface-container transition-colors`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-sm flex-shrink-0 ${i < 3 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {leader.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={leader.avatarUrl} alt={leader.displayName} className="w-full h-full rounded-full object-cover" />
                      ) : leader.displayName?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline font-bold text-sm text-on-surface truncate">{leader.displayName}</p>
                      <p className="text-xs text-on-surface-variant">{leader.recipeCount} recipes · {leader.ratingCount} ratings</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-headline font-bold text-primary">{leader.points.toLocaleString()}</p>
                      <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">points</p>
                    </div>
                    {i < 3 && <span className="text-xl flex-shrink-0">{['🥇', '🥈', '🥉'][i]}</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">?</div>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-on-surface">Your Ranking</p>
              <p className="text-xs text-on-surface-variant">Add recipes, rate dishes, and engage with the community to appear here!</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface mb-2">Culinary Challenges</h2>
            <p className="text-on-surface-variant text-sm">Complete these to earn points. Challenges reset weekly.</p>
          </div>
          <div className="space-y-4">
            {CHALLENGES.map(challenge => (
              <div key={challenge.id} className="p-5 rounded-2xl border border-outline/10 bg-surface-container-lowest">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{challenge.icon}</span>
                    <div>
                      <h3 className="font-headline font-bold text-on-surface text-sm">{challenge.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{challenge.description}</p>
                    </div>
                  </div>
                  <span className="font-headline font-bold text-primary text-sm flex-shrink-0 ml-2">+{challenge.points} pts</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${challenge.progress}%` }} />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 font-label">Not started</p>
              </div>
            ))}
          </div>

          <div className="bg-surface-container rounded-2xl p-6">
            <h3 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              How Points Work
            </h3>
            <div className="space-y-2">
              {[
                { action: 'Add a recipe', points: '+100' },
                { action: 'Rate a recipe', points: '+10' },
                { action: 'Comment on a recipe', points: '+15' },
                { action: 'Share a post', points: '+20' },
                { action: 'Get 10 likes on your recipe', points: '+50' },
                { action: 'Complete a challenge', points: '+varies' },
              ].map(({ action, points }) => (
                <div key={action} className="flex justify-between items-center py-1.5 border-b border-outline/10 last:border-0">
                  <span className="text-sm text-on-surface-variant">{action}</span>
                  <span className="font-label font-bold text-primary text-sm">{points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
