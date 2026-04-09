'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FOOD_EMOJIS = ['🍛','🍜','🥘','🍱','🥗','🍣','🌮','🥙','🍲','🫕','🥞','🍝','🥩','🍤','🫔','🥟','🍙','🧆','🥮','🍡'];

interface Particle { id: number; x: number; y: number; emoji: string; size: number; speed: number; opacity: number; drift: number; }
interface Trail { id: number; x: number; y: number; }

export default function LandingPage() {
  const router = useRouter();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [tagIdx, setTagIdx] = useState(0);
  const trailId = useRef(0);
  const raf = useRef<number>(0);
  const TAGS = ['Every dish has a story.', 'Every meal is a ritual.', 'Every recipe is living history.', 'Food connects us all.'];

  useEffect(() => {
    const t = setInterval(() => {
      const p: Particle = {
        id: Date.now() + Math.random(), x: Math.random() * 100, y: 110,
        emoji: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)],
        size: 16 + Math.random() * 24, speed: 0.3 + Math.random() * 0.5,
        opacity: 0.12 + Math.random() * 0.2, drift: (Math.random() - 0.5) * 0.3,
      };
      setParticles(prev => [...prev.slice(-20), p]);
    }, 700);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(p => ({ ...p, y: p.y - p.speed, x: p.x + p.drift })).filter(p => p.y > -10));
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY });
    const id = ++trailId.current;
    setTrails(prev => [...prev.slice(-10), { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setTrails(prev => prev.filter(t => t.id !== id)), 500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [onMove]);

  useEffect(() => {
    const t = setInterval(() => setTagIdx(i => (i + 1) % TAGS.length), 2800);
    return () => clearInterval(t);
  }, [TAGS.length]);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  function enter() {
    let ok = false;
    try {
      const tok = localStorage.getItem('cc_access_token');
      if (tok) { const p = JSON.parse(atob(tok.split('.')[1])); ok = Date.now() < p.exp * 1000; }
    } catch { /**/ }
    router.push(ok ? '/discovery' : '/login');
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080806] text-white" style={{ cursor: 'none' }}>
      <div className="pointer-events-none fixed z-[100] w-5 h-5 rounded-full border-2 border-[#a03f28] transition-transform duration-75"
        style={{ left: mouse.x - 10, top: mouse.y - 10 }} />
      <div className="pointer-events-none fixed z-[100] w-2 h-2 rounded-full bg-[#feb956]"
        style={{ left: mouse.x - 4, top: mouse.y - 4 }} />
      {trails.map((t, i) => (
        <div key={t.id} className="pointer-events-none fixed z-50 rounded-full"
          style={{ left: t.x - 3, top: t.y - 3, width: 6, height: 6, background: `rgba(160,63,40,${0.5 - i * 0.04})` }} />
      ))}
      {particles.map(p => (
        <div key={p.id} className="pointer-events-none fixed z-10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.size, opacity: p.opacity }}>
          {p.emoji}
        </div>
      ))}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: `radial-gradient(500px at ${mouse.x}px ${mouse.y}px, rgba(160,63,40,0.07), transparent 60%)` }} />
      <div className="absolute inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.18] animate-pulse"
        style={{ background: 'radial-gradient(circle,#a03f28,transparent)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-[0.12] animate-pulse"
        style={{ background: 'radial-gradient(circle,#feb956,transparent)', animationDelay: '1.5s' }} />
      <div className={`relative z-20 flex flex-col min-h-screen transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a03f28] to-[#feb956] flex items-center justify-center text-lg">🧭</div>
            <div>
              <p className="font-black text-sm tracking-tight text-white">Global Culinary Compass</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">by Anannya Vyas</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <Link href="/discovery" className="hover:text-white transition-colors">Discover</Link>
            <Link href="/culture" className="hover:text-white transition-colors">Culture</Link>
            <Link href="/health" className="hover:text-white transition-colors">Health</Link>
            <Link href="/academy" className="hover:text-white transition-colors">Academy</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/50 hover:text-white text-sm font-medium transition-colors px-3 py-1.5">Sign In</Link>
            <Link href="/register" className="px-5 py-2 bg-[#a03f28] hover:bg-[#c0573e] text-white text-sm font-bold rounded-full transition-all hover:scale-105 active:scale-95">Join Free</Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm mb-10 text-xs font-bold uppercase tracking-widest text-white/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#feb956] animate-pulse" />
            500+ Recipes · 30+ Cultures · 10 Languages
          </div>
          <h1 className="font-black text-5xl md:text-7xl lg:text-[88px] tracking-tighter leading-[0.95] mb-6 max-w-5xl">
            <span className="block text-white">The World&apos;s</span>
            <span className="block" style={{ background: 'linear-gradient(135deg,#a03f28 0%,#feb956 50%,#c0573e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Culinary Archive
            </span>
          </h1>
          <div className="h-7 mb-10 overflow-hidden">
            <p key={tagIdx} className="text-white/50 text-lg font-medium" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              {TAGS[tagIdx]}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button onClick={enter} className="group px-10 py-4 text-white font-bold text-lg rounded-full transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#a03f28,#c0573e)', boxShadow: '0 0 40px rgba(160,63,40,0.35)' }}>
              <span className="flex items-center gap-2">Explore Now <span className="group-hover:translate-x-1 transition-transform inline-block">→</span></span>
            </button>
            <Link href="/culture" className="px-10 py-4 border border-white/15 text-white font-bold text-lg rounded-full hover:bg-white/5 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">Our Story</Link>
          </div>
          <div className="flex items-center gap-10 md:gap-20">
            {[['500+','Recipes'],['30+','Regions'],['10','Languages'],['∞','Stories']].map(([v,l]) => (
              <div key={l} className="text-center">
                <p className="font-black text-2xl md:text-3xl text-white">{v}</p>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">{l}</p>
              </div>
            ))}
          </div>
        </main>
        <section className="border-t border-white/5 bg-white/[0.015]">
          <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{icon:'🌍',title:'Global Recipes',desc:'Authentic dishes from every corner of the world'},{icon:'🌿',title:'Food as Medicine',desc:'Ayurveda, TCM & modern nutrition science'},{icon:'📖',title:'Culture & Story',desc:'The history behind every dish'},{icon:'🎓',title:'Culinary Academy',desc:'Learn knife skills, fermentation & more'}].map(({icon,title,desc}) => (
              <div key={title} className="group text-center p-4 rounded-2xl hover:bg-white/5 transition-all cursor-default">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
                <p className="font-bold text-white text-sm mb-1">{title}</p>
                <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <footer className="border-t border-white/5 bg-black/20">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🧭</span><span className="font-black text-white tracking-tight">Global Culinary Compass</span></div>
                <p className="text-white/40 text-sm leading-relaxed">A living archive of the world&apos;s culinary heritage. Every dish has a story. Every meal is a ritual.</p>
              </div>
              <div>
                <p className="font-bold text-white/60 text-xs uppercase tracking-widest mb-3">Explore</p>
                <div className="space-y-2">
                  {[['Discovery','/discovery'],['Culture & Story','/culture'],['Health Kitchen','/health'],['Culinary Academy','/academy'],['The Garden','/garden']].map(([label,href]) => (
                    <Link key={href} href={href} className="block text-white/40 hover:text-white text-sm transition-colors">{label}</Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-white/60 text-xs uppercase tracking-widest mb-3">Contact</p>
                <p className="text-white/60 text-sm font-medium mb-1">Anannya Vyas</p>
                <a href="mailto:vyasanannya@gmail.com" className="text-[#feb956] hover:text-[#ffd080] text-sm transition-colors flex items-center gap-2"><span>✉</span> vyasanannya@gmail.com</a>
                <p className="text-white/30 text-xs mt-3">For partnerships, feedback, or anything about the app — reach out anytime.</p>
              </div>
            </div>
            <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-white/25 text-xs">© 2024 Global Culinary Compass · Built by Anannya Vyas</p>
              <p className="text-white/25 text-xs">Every dish has a story. Every meal is a ritual.</p>
            </div>
          </div>
        </footer>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
