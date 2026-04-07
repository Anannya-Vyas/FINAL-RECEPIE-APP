'use client';

import { useState } from 'react';
import Link from 'next/link';

const FOOD_RITUALS = [
  { month: 'January', festival: 'Makar Sankranti', country: 'India', dish: 'Til Ladoo & Khichdi', story: 'The harvest festival of the sun. Sesame seeds (til) represent warmth and prosperity. Families fly kites and share til ladoo — the sweetness of sesame symbolizes the sweetness of new beginnings.', emoji: '🪁', color: 'bg-tertiary-fixed' },
  { month: 'January', festival: 'Pongal', country: 'Tamil Nadu, India', dish: 'Sweet Pongal', story: 'The Tamil harvest festival. Rice is cooked in a new clay pot until it overflows — "Pongal!" means "it boils over!" — symbolizing abundance. The overflow is a blessing.', emoji: '🍚', color: 'bg-secondary-fixed' },
  { month: 'February', festival: 'Chinese New Year', country: 'China', dish: 'Dumplings & Fish', story: 'Dumplings shaped like ancient gold ingots bring wealth. Fish (鱼, yú) sounds like "surplus" — always served whole, never cut, so luck stays intact. The last bite is saved for tomorrow.', emoji: '🥟', color: 'bg-primary-fixed' },
  { month: 'March', festival: 'Holi', country: 'India', dish: 'Gujiya & Thandai', story: 'The festival of colors. Gujiya — sweet dumplings filled with khoya — are made in every home. Thandai, a spiced milk drink, cools the body after hours of playing with colors in the spring heat.', emoji: '🎨', color: 'bg-tertiary-fixed' },
  { month: 'April', festival: 'Nowruz', country: 'Iran/Central Asia', dish: 'Sabzi Polo Mahi', story: 'Persian New Year. Herb rice with fish — the green herbs represent spring\'s rebirth, the fish represents life. The Haft-Seen table has seven symbolic items, each starting with "S" in Persian.', emoji: '🌱', color: 'bg-secondary-fixed' },
  { month: 'May', festival: 'Eid al-Fitr', country: 'Global Muslim World', dish: 'Sheer Khurma & Biryani', story: 'Breaking the Ramadan fast. Sheer khurma — vermicelli cooked in milk with dates and nuts — is the first sweet of Eid morning. Biryani is the celebratory feast shared with neighbors.', emoji: '🌙', color: 'bg-primary-fixed' },
  { month: 'August', festival: 'Onam', country: 'Kerala, India', dish: 'Sadya (26-dish feast)', story: 'The harvest festival of Kerala. A banana leaf feast with 26 dishes — each placed in a specific position. The meal is eaten with the right hand only, sitting on the floor, in a specific order.', emoji: '🍌', color: 'bg-tertiary-fixed' },
  { month: 'October', festival: 'Diwali', country: 'India', dish: 'Mithai & Chakli', story: 'The festival of lights. Every family makes their own mithai (sweets) — recipes passed down for generations. The smell of ghee and cardamom means Diwali is here. Sweets are exchanged as gifts of love.', emoji: '🪔', color: 'bg-secondary-fixed' },
  { month: 'November', festival: 'Thanksgiving', country: 'USA', dish: 'Turkey & Pumpkin Pie', story: 'A harvest feast rooted in 1621. The turkey, stuffing, cranberry sauce — each family has their own version. The meal is less about the food and more about the table it\'s shared at.', emoji: '🦃', color: 'bg-primary-fixed' },
  { month: 'December', festival: 'Christmas', country: 'Global', dish: 'Plum Pudding & Stollen', story: 'The Christmas pudding was stirred by every family member, each making a wish. Hidden inside: a coin for wealth, a ring for marriage. The tradition of hiding things in food is ancient magic.', emoji: '🎄', color: 'bg-tertiary-fixed' },
  { month: 'December', festival: 'Winter Solstice', country: 'Japan', dish: 'Yuzu Bath & Kabocha', story: 'On the shortest day, Japanese families bathe in yuzu-filled water for good health. Kabocha squash is eaten for luck. The yuzu\'s fragrance is said to ward off evil spirits.', emoji: '🍊', color: 'bg-secondary-fixed' },
];

const ORIGIN_STORIES = [
  { dish: 'Biryani', origin: 'Persia → Mughal India', story: 'Biryani traveled the Silk Road from Persia to India with the Mughal armies. The word comes from Persian "birian" (fried before cooking). Each region adapted it — Hyderabadi dum biryani, Lucknowi awadhi, Kolkata biryani with potato. The potato was added during a famine when meat was scarce.', emoji: '🍚', year: '~1600 CE' },
  { dish: 'Ramen', origin: 'China → Japan', story: 'Ramen arrived in Japan with Chinese immigrants in the late 1800s. After WWII, American wheat flooded Japan and ramen became the food of survival. Each region developed its own soul — Sapporo\'s miso, Fukuoka\'s tonkotsu, Tokyo\'s shoyu. Today it\'s Japan\'s most beloved comfort food.', emoji: '🍜', year: '~1900 CE' },
  { dish: 'Tacos', origin: 'Pre-Columbian Mexico', story: 'Tacos predate the Spanish conquest. Aztec workers in silver mines used corn tortillas to hold their food — the original "taco" meant a small charge of gunpowder wrapped in paper. The taco al pastor came from Lebanese immigrants who brought shawarma to Mexico City in the 1930s.', emoji: '🌮', year: '~1000 BCE' },
  { dish: 'Hummus', origin: 'Levant (disputed)', story: 'The oldest known hummus recipe is from 13th century Cairo. But chickpeas have been eaten in the Middle East for 10,000 years. Today, Lebanon, Israel, Palestine, and Syria all claim hummus as their own — a dish that transcends borders and belongs to everyone.', emoji: '🫘', year: '~1200 CE' },
  { dish: 'Kimchi', origin: 'Korea', story: 'Kimchi is 2,000 years old, but the chili pepper version is only 400 years old — chilies arrived from the Americas via Portuguese traders. Before chilies, kimchi was white. The fermentation process was developed to survive Korean winters. Today, 1.8 million tons are made annually.', emoji: '🥬', year: '~100 BCE' },
  { dish: 'Pasta', origin: 'China → Arab World → Italy', story: 'Marco Polo did NOT bring pasta to Italy — that\'s a myth. Arab traders brought dried pasta to Sicily in the 9th century. The Italians perfected it. The tomato sauce came only after 1492, when tomatoes arrived from the Americas. Before that, pasta was eaten with cheese and spices.', emoji: '🍝', year: '~900 CE' },
];

export default function CulturePage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'stories' | 'grandma'>('calendar');
  const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <section className="mb-10">
        <span className="font-label text-primary font-bold tracking-[0.2em] text-xs uppercase mb-2 block">Heritage First</span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Culture & Story</h1>
        <p className="text-on-surface-variant mt-2 max-w-2xl text-lg">Every dish has a story. Every meal is a ritual. Every recipe is a piece of living history.</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-surface-container rounded-xl p-1.5 w-fit overflow-x-auto no-scrollbar">
        {[{ id: 'calendar', label: '📅 Food Ritual Calendar' }, { id: 'stories', label: '📖 Dish Origin Stories' }, { id: 'grandma', label: '👵 Grandma Voice Mode' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-5 py-2.5 rounded-lg font-label font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="p-4 bg-tertiary-fixed rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-on-tertiary-fixed">calendar_today</span>
            <p className="text-sm text-on-tertiary-fixed font-medium">This month is <strong>{currentMonth}</strong> — see what people around the world are cooking right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOOD_RITUALS.map((ritual, i) => (
              <div key={i} className={`${ritual.color} rounded-2xl p-6 border border-outline/10`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{ritual.month}</span>
                    <h3 className="font-headline font-bold text-on-surface text-lg mt-0.5">{ritual.festival}</h3>
                    <p className="text-xs text-on-surface-variant">{ritual.country}</p>
                  </div>
                  <span className="text-4xl">{ritual.emoji}</span>
                </div>
                <div className="bg-surface/60 backdrop-blur-sm rounded-xl p-3 mb-3">
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Traditional Dish</p>
                  <p className="font-headline font-bold text-sm text-on-surface">{ritual.dish}</p>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{ritual.story}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="space-y-6">
          <p className="text-on-surface-variant">The history behind the world&apos;s most beloved dishes — where they came from, how they traveled, and why they matter.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORIGIN_STORIES.map((story, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline/10 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-5xl flex-shrink-0">{story.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-headline font-bold text-on-surface text-xl">{story.dish}</h3>
                      <span className="text-[10px] bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-label font-bold">{story.year}</span>
                    </div>
                    <p className="text-primary font-label text-xs font-bold uppercase tracking-widest mb-3">{story.origin}</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{story.story}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grandma' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-tertiary-fixed to-surface-container rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">👵</div>
              <div>
                <h2 className="font-headline text-2xl font-bold text-on-surface">Grandma Voice Mode</h2>
                <p className="text-on-surface-variant">Recipes narrated like a story — the way a grandmother would teach you, not a clinical list of steps.</p>
              </div>
            </div>
            <div className="bg-surface/60 backdrop-blur-sm rounded-2xl p-6">
              <p className="font-label text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Example: Dal Makhani</p>
              <p className="text-on-surface leading-relaxed italic text-lg">
                &ldquo;Beta, first you must soak the dal overnight — don&apos;t rush this, the dal needs to rest just like you do. In the morning, pressure cook it until it&apos;s so soft it melts on your tongue. Now, in a heavy-bottomed pan — not a thin one, it will burn — melt the butter slowly. Add the onions and let them turn golden, not brown, golden like the afternoon sun. The secret? A pinch of hing. Your nani always said hing is what makes dal taste like home...&rdquo;
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-sm text-on-surface-variant">Grandma Voice Mode is available on any recipe page. Click the audio guide and select &ldquo;Grandma Mode&rdquo; to hear recipes narrated as stories.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Story Mode', desc: 'Recipes told as family stories with cultural context', icon: 'history_edu' },
              { title: 'Regional Dialects', desc: 'Available in Punjabi, Tamil, Bengali, and more', icon: 'language' },
              { title: 'Slow Narration', desc: 'Paced for cooking — pauses at each step', icon: 'slow_motion_video' },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline/10">
                <span className="material-symbols-outlined text-primary text-2xl mb-3 block">{icon}</span>
                <h3 className="font-headline font-bold text-on-surface mb-1">{title}</h3>
                <p className="text-sm text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/discovery" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-label font-bold text-sm uppercase tracking-widest hover:shadow-lg transition-all">
              <span className="material-symbols-outlined text-sm">restaurant_menu</span>
              Browse Recipes with Grandma Mode
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
