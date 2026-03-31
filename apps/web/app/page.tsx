'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);

    const timeout = setTimeout(() => {
      let loggedIn = false;
      try {
        const token = localStorage.getItem('cc_access_token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          loggedIn = Date.now() < payload.exp * 1000;
        }
      } catch { /* ignore */ }
      router.push(loggedIn ? '/discovery' : '/login');
    }, 2500);

    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [router]);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 grid grid-cols-12 grid-rows-6 gap-4 p-4 opacity-10 pointer-events-none">
        <div className="col-span-4 row-span-2 bg-surface-container rounded-xl" />
        <div className="col-span-8 row-span-3 bg-surface-container-high rounded-xl" />
        <div className="col-span-3 row-span-4 bg-surface-container-low rounded-xl" />
        <div className="col-span-5 row-span-2 bg-surface-variant rounded-xl" />
        <div className="col-span-4 row-span-3 bg-surface-container-highest rounded-xl" />
      </div>

      <div className="absolute inset-0 z-10">
        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <div className="bg-surface/40 backdrop-blur-2xl p-12 md:p-16 rounded-[2.5rem] shadow-2xl border border-outline-variant/20 flex flex-col items-center">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <span className="material-symbols-outlined text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1", fontSize: '64px' }}>explore</span>
            <h1 className="font-headline font-black text-4xl md:text-6xl tracking-tighter text-primary leading-none">
              Global Culinary Compass
            </h1>
            <p className="font-headline font-bold text-lg md:text-xl tracking-widest text-on-surface-variant uppercase mt-2">
              The Digital Gastronome
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6 w-full max-w-xs">
            <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label text-xs tracking-[0.2em] text-on-surface-variant uppercase font-bold">
                Synchronizing Global Palates
              </span>
              <span className="flex space-x-1">
                <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3 bg-secondary-fixed/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-secondary/10 shadow-lg">
          <span className="material-symbols-outlined text-on-secondary-fixed" style={{ fontSize: '16px' }}>auto_awesome</span>
          <span className="font-label text-xs font-bold text-on-secondary-fixed tracking-wider uppercase">
            AI Analysis: Global Seasonality Active
          </span>
        </div>
      </div>

      <div className="absolute top-10 left-10 z-20 border-l border-t border-primary/20 w-24 h-24" />
      <div className="absolute bottom-10 right-10 z-20 border-r border-b border-primary/20 w-24 h-24" />

      <footer className="absolute bottom-10 z-20 w-full px-12 flex flex-col md:flex-row justify-between items-center text-on-surface-variant opacity-60">
        <div className="font-body text-xs tracking-wide mb-4 md:mb-0">
          © 2024 Global Culinary Compass. Crafted for the Digital Gastronome.
        </div>
        <div className="flex gap-8 items-center">
          <span className="font-label text-[10px] font-extrabold uppercase tracking-widest">Precision Engineering</span>
          <div className="w-1 h-1 bg-outline-variant rounded-full" />
          <span className="font-label text-[10px] font-extrabold uppercase tracking-widest">Heritage Verified</span>
        </div>
      </footer>
    </main>
  );
}
