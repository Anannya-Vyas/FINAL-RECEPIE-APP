'use client';

import { useState } from 'react';

const CHALLENGES = [
  { id: 1, title: 'The Risotto Master', points: 500, description: 'Cook 3 different types of risotto this week.', progress: 66, icon: '🍚', color: 'bg-primary/10 border-primary/20' },
  { id: 2, title: 'Global Explorer', points: 1000, description: 'Try recipes from 5 different continents.', progress: 20, icon: '🌍', color: 'bg-secondary/10 border-secondary/20' },
  { id: 3, title: 'Early Bird', points: 300, description: 'Prepare a healthy breakfast 5 days in a row.', progress: 80, icon: '🌅', color: 'bg-tertiary/10 border-tertiary/20' },
  { id: 4, title: 'Community Star', points: 750, description: 'Share 2 recipes and get 50 likes.', progress: 45, icon: '⭐', color: 'bg-primary/10 border-primary/20' },
  { id: 5, title: 'Spice Adventurer', points: 400, description: 'Cook with 10 different spices this month.', progress: 60, icon: '🌶️', color: 'bg-secondary/10 border-secondary/20' },
  { id: 6, title: 'Heritage Keeper', points: 600, description: 'Add 3 family/grandmother recipes to the archive.', progress: 33, icon: '👵', color: 'bg-tertiary/10 border-tertiary/20' },
];

const WEEKLY_LEADERS = [
  { rank: 1, name: 'Priya Sharma', avatar: '👩‍🍳', points: 4820, badge: '🥇', recipes: 23, country: 'India' },
  { rank: 2, name: 'Marco Rossi', avatar: '👨‍🍳', points: 4210, badge: '🥈', recipes: 19, country: 'Italy' },
  { rank: 3, name: 'Yuki Tanaka', avatar: '🧑‍🍳', points: 3890, badge: '🥉', recipes: 17, country: 'Japan' },
  { rank: 4, name: 'Fatima Al-Hassan', avatar: '👩‍🍳', points: 3450, badge: '', recipes: 15, country: 'Morocco' },
  { rank: 5, name: 'Carlos Mendez', avatar: '👨‍🍳', points: 3120, badge: '', recipes: 14, country: 'Mexico' },
  { rank: 6, name: 'Sophie Chen', avatar: '👩‍🍳', points: 2980, badge: '', recipes: 13, country: 'China' },
  { rank: 7, name: 'Arjun Patel', avatar: '👨‍🍳', points: 2750, badge: '', recipes: 12, country: 'India' },
  { rank: 8, name: 'Elena Petrov', avatar: '👩‍🍳', points: 2540, badge: '', recipes: 11, country: 'Russia' },
  { rank: 9, name: 'James Okafor', avatar: '👨‍🍳', points: 2310, badge: '', recipes: 10, country: 'Nigeria' },
  { rank: 10, name: 'Ana Lima', avatar: '👩‍🍳', points: 2100, badge: '', recipes: 9, country: 'Brazil' },
];

const MONTHLY_LEADERS = [
  { rank: 1, name: 'Marco Rossi', avatar: '👨‍🍳', points: 18420, badge: '🥇', recipes: 89, country: 'Italy' },
  { rank: 2, name: 'Priya Sharma', avatar: '👩‍🍳', points: 16800, badge: '🥈', recipes: 82, country: 'India' },
  { rank: 3, name: 'Sophie Chen', avatar: '🧑‍🍳', points: 15200, badge: '🥉', recipes: 74, country: 'China' },
  { rank: 4, name: 'Carlos Mendez', avatar: '👨‍🍳', points: 14100, badge: '', recipes: 68, country: 'Mexico' },
  { rank: 5, name: 'Yuki Tanaka', avatar: '🧑‍🍳', points: 13500, badge: '', recipes: 65, country: 'Japan' },
];

type Period = 'weekly' | 'monthly' | 'alltime';
type Category = 'overall' | 'recipes' | 'views' | 'community';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [category, setCategory] = useState<Category>('overall');

  const leaders = period === 'monthly' ? MONTHLY_LEADERS : WEEKLY_LEADERS;

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <section className="mb-12">
        <span className="font-label text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Community Rankings</span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Leaderboard</h1>
        <p className="text-on-surface-variant mt-2 max-w-xl">Rankings update every week. All data is transparent — nothing is hidden from the community.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Leaderboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Period selector */}
          <div className="flex gap-2 bg-surface-container rounded-xl p-1.5 w-fit">
            {(['weekly', 'monthly', 'alltime'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-5 py-2 rounded-lg font-label font-bold text-sm capitalize transition-all ${period === p ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                {p === 'alltime' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Category selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[{ value: 'overall', label: '🏆 Overall' }, { value: 'recipes', label: '🍳 Most Recipes' }, { value: 'views', label: '👁️ Most Views' }, { value: 'community', label: '❤️ Community' }].map(({ value, label }) => (
              <button key={value} onClick={() => setCategory(value as Category)} className={`px-4 py-2 rounded-full font-label text-xs font-bold tracking-widest whitespace-nowrap transition-all ${category === value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd place */}
            <div className="flex flex-col items-center pt-8">
              <div className="text-4xl mb-2">{leaders[1]?.avatar}</div>
              <div className="w-full bg-surface-container rounded-t-2xl p-4 text-center">
                <p className="text-2xl mb-1">🥈</p>
                <p className="font-headline font-bold text-sm text-on-surface">{leaders[1]?.name}</p>
                <p className="text-xs text-on-surface-variant">{leaders[1]?.country}</p>
                <p className="font-headline font-bold text-primary mt-1">{leaders[1]?.points.toLocaleString()} pts</p>
              </div>
            </div>
            {/* 1st place */}
            <div className="flex flex-col items-center">
              <div className="text-5xl mb-2">{leaders[0]?.avatar}</div>
              <div className="w-full bg-gradient-to-b from-tertiary-fixed to-surface-container rounded-t-2xl p-4 text-center shadow-lg">
                <p className="text-3xl mb-1">🥇</p>
                <p className="font-headline font-bold text-sm text-on-surface">{leaders[0]?.name}</p>
                <p className="text-xs text-on-surface-variant">{leaders[0]?.country}</p>
                <p className="font-headline font-bold text-primary mt-1">{leaders[0]?.points.toLocaleString()} pts</p>
              </div>
            </div>
            {/* 3rd place */}
            <div className="flex flex-col items-center pt-12">
              <div className="text-3xl mb-2">{leaders[2]?.avatar}</div>
              <div className="w-full bg-surface-container-high rounded-t-2xl p-4 text-center">
                <p className="text-xl mb-1">🥉</p>
                <p className="font-headline font-bold text-sm text-on-surface">{leaders[2]?.name}</p>
                <p className="text-xs text-on-surface-variant">{leaders[2]?.country}</p>
                <p className="font-headline font-bold text-primary mt-1">{leaders[2]?.points.toLocaleString()} pts</p>
              </div>
            </div>
          </div>

          {/* Full rankings */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline/10 overflow-hidden shadow-sm">
            {leaders.map((leader, i) => (
              <div key={leader.rank} className={`flex items-center gap-4 p-4 ${i < leaders.length - 1 ? 'border-b border-outline/10' : ''} hover:bg-surface-container transition-colors`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-sm flex-shrink-0 ${leader.rank <= 3 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-surface-container text-on-surface-variant'}`}>
                  {leader.rank}
                </div>
                <div className="text-2xl flex-shrink-0">{leader.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-headline font-bold text-sm text-on-surface">{leader.name}</p>
                  <p className="text-xs text-on-surface-variant">{leader.country} · {leader.recipes} recipes</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-headline font-bold text-primary">{leader.points.toLocaleString()}</p>
                  <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">points</p>
                </div>
                {leader.badge && <span className="text-xl flex-shrink-0">{leader.badge}</span>}
              </div>
            ))}
          </div>

          {/* Your rank */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-sm">?</div>
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <p className="font-headline font-bold text-sm text-on-surface">Your Ranking</p>
              <p className="text-xs text-on-surface-variant">Start cooking and rating to appear on the leaderboard!</p>
            </div>
            <div className="text-right">
              <p className="font-headline font-bold text-secondary">0</p>
              <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">points</p>
            </div>
          </div>
        </div>

        {/* Right: Challenges */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface mb-2">Culinary Challenges</h2>
            <p className="text-on-surface-variant text-sm">Complete weekly tasks to earn points and climb the leaderboard.</p>
          </div>

          <div className="space-y-4">
            {CHALLENGES.map(challenge => (
              <div key={challenge.id} className={`p-5 rounded-2xl border ${challenge.color} bg-surface-container-lowest`}>
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
                <div>
                  <div className="flex justify-between text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all" style={{ width: `${challenge.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How points work */}
          <div className="bg-surface-container rounded-2xl p-6">
            <h3 className="font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              How Points Work
            </h3>
            <div className="space-y-2">
              {[
                { action: 'View a recipe', points: '+5' },
                { action: 'Rate a recipe', points: '+10' },
                { action: 'Comment on a recipe', points: '+15' },
                { action: 'Share a post', points: '+20' },
                { action: 'Add your own recipe', points: '+100' },
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
