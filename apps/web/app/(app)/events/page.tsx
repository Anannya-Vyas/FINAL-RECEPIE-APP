'use client';

import { useState } from 'react';
import Link from 'next/link';

const EVENTS = [
  {
    id: '1',
    title: "Grandma's Live Kitchen: Handmade Orecchiette",
    type: 'Live Session',
    tag: 'Traditional Heritage',
    date: 'Apr 24, 18:00 UTC',
    location: 'Digital Studio A',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    description: 'Join Nonna Maria as she teaches the ancient art of handmade orecchiette pasta from Puglia, Italy. A 2-hour live session with Q&A.',
    price: 'Free',
    attendees: 1240,
    featured: true,
  },
  {
    id: '2',
    title: 'Regional Fermentation Series: Kimchi & Miso',
    type: 'Workshop',
    tag: 'Hands-On',
    date: 'May 05, 14:00 UTC',
    location: 'Online Workshop',
    image: 'https://images.unsplash.com/photo-1608500218890-c4f9d3a5b5e8?w=800&q=80',
    description: 'Master the art of Korean Kimchi and Japanese Miso with artisan practitioners. Take-home recipe cards included.',
    price: '₹450',
    attendees: 89,
    featured: false,
  },
  {
    id: '3',
    title: 'Neon Nights: Saigon Street Food Pop-up',
    type: 'Dining',
    tag: 'Community Dinner',
    date: 'May 12, 19:30 UTC',
    location: 'Virtual Dining Experience',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    description: 'A high-energy dining experience featuring the authentic flavors of Vietnam. Cook along and share your results.',
    price: '₹850',
    attendees: 234,
    featured: false,
  },
  {
    id: '4',
    title: 'Community Biryani Night',
    type: 'Live Cook',
    tag: 'Community Gathering',
    date: 'Apr 19, 19:00 IST',
    location: 'Digital Kitchen',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    description: 'Cook authentic Hyderabadi dum biryani together with 500+ home chefs. Chef Arjun will guide you step by step.',
    price: 'Free',
    attendees: 512,
    featured: false,
  },
  {
    id: '5',
    title: 'Masa Kneading 101: Mexican Tortillas',
    type: 'Workshop',
    tag: 'Beginner Friendly',
    date: 'Apr 26, 14:00 UTC',
    location: 'Online Workshop',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
    description: 'Learn the ancient technique of masa preparation and hand-press perfect corn tortillas from scratch.',
    price: '₹350',
    attendees: 67,
    featured: false,
  },
  {
    id: '6',
    title: 'Tokyo Street Food Pop-up',
    type: 'Dining',
    tag: 'Cultural Experience',
    date: 'Nov 02, 19:30 UTC',
    location: 'Virtual Experience',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80',
    description: 'Experience the vibrant street food culture of Tokyo — takoyaki, yakitori, and ramen from scratch.',
    price: '₹650',
    attendees: 178,
    featured: false,
  },
];

const TYPE_COLORS: Record<string, string> = {
  'Live Session': 'bg-tertiary-fixed text-on-tertiary-fixed',
  'Workshop': 'bg-secondary-fixed text-on-secondary-fixed',
  'Dining': 'bg-primary-fixed text-on-primary-fixed',
  'Live Cook': 'bg-secondary text-on-secondary',
};

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  const filters = ['All', 'Live Session', 'Workshop', 'Dining', 'Live Cook'];
  const filtered = activeFilter === 'All' ? EVENTS : EVENTS.filter(e => e.type === activeFilter);
  const featured = filtered.find(e => e.featured);
  const rest = filtered.filter(e => !e.featured);

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label text-xs font-bold tracking-[0.15em] text-primary uppercase mb-2 block">Global Gatherings</span>
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-tight">
              Community <span className="text-primary italic">Events</span>
            </h1>
            <p className="mt-4 text-on-surface-variant max-w-xl text-lg leading-relaxed">
              Discover the pulse of global gastronomy through immersive workshops, pop-ups, live cooking sessions, and community dinners.
            </p>
          </div>
          <div className="flex bg-surface-container rounded-xl p-1.5 shadow-sm">
            <button onClick={() => setView('calendar')} className={`px-6 py-2.5 rounded-lg font-label font-bold text-sm transition-all ${view === 'calendar' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Calendar</button>
            <button onClick={() => setView('list')} className={`px-6 py-2.5 rounded-lg font-label font-bold text-sm transition-all ${view === 'list' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>List View</button>
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className={`px-6 py-2.5 rounded-full font-label text-sm font-bold tracking-widest whitespace-nowrap active:scale-95 transition-all ${activeFilter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'}`}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Featured event */}
        {featured && (
          <div className="md:col-span-8 group relative overflow-hidden rounded-[2rem] aspect-[4/5] md:aspect-[16/10] bg-surface-container-highest shadow-sm cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-md text-[10px] font-label font-bold uppercase tracking-wider ${TYPE_COLORS[featured.type] || 'bg-surface text-on-surface'}`}>{featured.type}</span>
                  <span className="text-white/80 font-label text-[10px] font-bold tracking-widest uppercase">{featured.date}</span>
                </div>
                <h2 className="text-white font-headline text-3xl font-bold leading-tight mb-2">{featured.title}</h2>
                <p className="text-white/70 text-sm line-clamp-2 font-body">{featured.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-white font-headline font-bold text-lg">{featured.price}</span>
                  <button className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-label font-bold text-sm uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                    Join Now
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-all active:scale-90">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </button>
                <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-secondary transition-all active:scale-90">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule sidebar */}
        <div className="md:col-span-4 bg-primary rounded-[2rem] p-8 text-on-primary flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-headline text-2xl font-bold mb-6">Your Schedule</h3>
            <div className="space-y-6">
              {EVENTS.slice(0, 3).map(event => (
                <div key={event.id} className="flex gap-4">
                  <div className="bg-white/20 rounded-lg w-12 h-12 flex flex-col items-center justify-center font-bold flex-shrink-0">
                    <span className="text-[10px] uppercase">{event.date.split(' ')[0]}</span>
                    <span className="text-lg">{event.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight">{event.title}</p>
                    <p className="text-xs text-white/70 mt-0.5">{event.type} · {event.date.split(',')[1]?.trim()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="relative z-10 mt-8 w-full bg-white text-primary font-bold py-3 rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group">
            Sync My Calendar
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Event cards */}
        {rest.map((event, i) => (
          <div key={event.id} className={`${i % 3 === 0 ? 'md:col-span-4' : i % 3 === 1 ? 'md:col-span-4' : 'md:col-span-4'} group relative overflow-hidden rounded-[2rem] bg-surface-container cursor-pointer shadow-sm hover:shadow-lg transition-shadow`}>
            <div className="h-56 relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur px-3 py-1 rounded-lg text-primary font-bold text-xs">{event.date.split(',')[0]}</div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[event.type] || 'bg-surface-container text-on-surface'}`}>{event.type}</span>
                <div className="flex-1 h-[1px] bg-outline-variant/20" />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2 leading-tight">{event.title}</h3>
              <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{event.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-primary font-headline font-bold text-lg">{event.price}</span>
                  <p className="text-xs text-on-surface-variant">{event.attendees.toLocaleString()} attending</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-label font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                  Join
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Find workshops map section */}
        <div className="md:col-span-12 mt-4">
          <section className="bg-surface-container-low rounded-[1.5rem] p-8 md:p-12 overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 z-10">
                <span className="text-primary font-bold font-label text-xs uppercase tracking-widest">Global Reach</span>
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold mt-2 mb-4 leading-tight">Find Workshops In Your City</h2>
                <p className="text-on-surface-variant mb-8 leading-relaxed max-w-md">Our community is growing. Find physical pop-ups and live culinary classes happening near you.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-full text-sm focus:ring-2 focus:ring-primary shadow-sm" placeholder="Enter your city..." type="text" />
                  </div>
                  <button className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-bold transition-transform active:scale-95 shadow-md">Locate</button>
                </div>
              </div>
              <div className="flex-1 w-full">
                <Link href="/map" className="block w-full h-[300px] bg-surface-variant rounded-2xl overflow-hidden shadow-inner relative group border border-outline-variant/20 hover:shadow-lg transition-shadow">
                  <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950 flex items-center justify-center">
                    <div className="text-center text-white">
                      <span className="material-symbols-outlined text-6xl text-primary mb-3 block">map</span>
                      <p className="font-headline font-bold text-xl">Open Interactive Map</p>
                      <p className="text-white/60 text-sm mt-1">Find events near you</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
