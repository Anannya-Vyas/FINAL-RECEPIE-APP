'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';

const CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', icon: '🩸', color: 'bg-red-50 border-red-200 text-red-700', tag: 'diabetic-friendly', description: 'Low glycemic index recipes, no refined sugar' },
  { id: 'hypertension', label: 'Hypertension', icon: '❤️', color: 'bg-pink-50 border-pink-200 text-pink-700', tag: 'low-sodium', description: 'Low sodium, heart-healthy options' },
  { id: 'thyroid', label: 'Thyroid Issues', icon: '🦋', color: 'bg-purple-50 border-purple-200 text-purple-700', tag: 'thyroid-friendly', description: 'Iodine-balanced, goitrogen-aware recipes' },
  { id: 'pcod', label: 'PCOD/PCOS', icon: '🌸', color: 'bg-rose-50 border-rose-200 text-rose-700', tag: 'pcod-friendly', description: 'Anti-inflammatory, hormone-balancing foods' },
  { id: 'kidney', label: 'Kidney Disease', icon: '🫘', color: 'bg-orange-50 border-orange-200 text-orange-700', tag: 'kidney-friendly', description: 'Low potassium, low phosphorus recipes' },
  { id: 'cholesterol', label: 'High Cholesterol', icon: '💛', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', tag: 'low-cholesterol', description: 'Heart-healthy fats, fiber-rich foods' },
  { id: 'gluten', label: 'Gluten Intolerance', icon: '🌾', color: 'bg-amber-50 border-amber-200 text-amber-700', tag: 'gluten-free', description: 'Certified gluten-free recipes' },
  { id: 'lactose', label: 'Lactose Intolerance', icon: '🥛', color: 'bg-blue-50 border-blue-200 text-blue-700', tag: 'dairy-free', description: 'Dairy-free alternatives and recipes' },
];

const INGREDIENT_HEALERS = [
  { name: 'Turmeric (Haldi)', benefit: 'Anti-inflammatory', science: 'Curcumin reduces inflammation markers by up to 65%', tradition: 'Ayurveda: "Golden medicine" used for 4,000 years', emoji: '🟡', conditions: ['arthritis', 'inflammation', 'immunity'] },
  { name: 'Methi (Fenugreek)', benefit: 'Blood Sugar Control', science: 'Soluble fiber slows glucose absorption, reduces HbA1c', tradition: 'Unani medicine: prescribed for diabetes since 1000 CE', emoji: '🌿', conditions: ['diabetes', 'cholesterol', 'pcod'] },
  { name: 'Amla (Indian Gooseberry)', benefit: 'Immunity Booster', science: '20x more Vitamin C than orange, powerful antioxidant', tradition: 'Ayurveda: "Amalaki" — the fruit of immortality', emoji: '🟢', conditions: ['immunity', 'hair', 'digestion'] },
  { name: 'Ginger (Adrak)', benefit: 'Digestive Health', science: 'Gingerols reduce nausea, improve gut motility', tradition: 'TCM: "Universal medicine" for 2,500 years', emoji: '🫚', conditions: ['digestion', 'nausea', 'inflammation'] },
  { name: 'Garlic (Lahsun)', benefit: 'Heart Health', science: 'Allicin reduces blood pressure by 8-10 mmHg', tradition: 'Ancient Egypt: fed to pyramid builders for strength', emoji: '🧄', conditions: ['hypertension', 'cholesterol', 'immunity'] },
  { name: 'Ashwagandha', benefit: 'Stress & Thyroid', science: 'Reduces cortisol by 28%, supports thyroid T3/T4', tradition: 'Ayurveda: "Strength of a horse" adaptogen', emoji: '🌱', conditions: ['thyroid', 'stress', 'pcod'] },
  { name: 'Cinnamon (Dalchini)', benefit: 'Blood Sugar', science: 'Improves insulin sensitivity, lowers fasting glucose', tradition: 'Chinese medicine: warming spice for 2,700 years', emoji: '🟤', conditions: ['diabetes', 'cholesterol', 'pcod'] },
  { name: 'Moringa (Drumstick)', benefit: 'Complete Nutrition', science: '7x more Vitamin C than orange, 4x more calcium than milk', tradition: 'Ayurveda: "Miracle tree" — treats 300 diseases', emoji: '🌿', conditions: ['malnutrition', 'diabetes', 'inflammation'] },
];

interface Recipe {
  id: string;
  title: string;
  coverImageUrl?: string;
  region?: { name: string };
  dietaryTags?: string[];
}

export default function HealthPage() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'conditions' | 'healers' | 'planner'>('conditions');
  const [savedConditions, setSavedConditions] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cc_health_conditions') || '[]');
    setSavedConditions(saved);
    setSelectedConditions(saved);
    if (saved.length > 0) loadHealthRecipes(saved);
  }, []);

  async function loadHealthRecipes(conditions: string[]) {
    if (conditions.length === 0) { setRecipes([]); return; }
    setLoading(true);
    try {
      const tags = conditions.map(c => CONDITIONS.find(x => x.id === c)?.tag).filter(Boolean);
      const { data } = await api.get('/api/recipes', { params: { dietary_tag: tags[0], limit: 12 } });
      setRecipes(data.recipes || []);
    } catch { setRecipes([]); }
    finally { setLoading(false); }
  }

  function toggleCondition(id: string) {
    const updated = selectedConditions.includes(id)
      ? selectedConditions.filter(c => c !== id)
      : [...selectedConditions, id];
    setSelectedConditions(updated);
    localStorage.setItem('cc_health_conditions', JSON.stringify(updated));
    setSavedConditions(updated);
    loadHealthRecipes(updated);
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <section className="mb-10">
        <span className="font-label text-xs font-bold tracking-[0.2em] text-primary uppercase mb-2 block">Food as Medicine</span>
        <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface">Health Kitchen</h1>
        <p className="text-on-surface-variant mt-2 max-w-2xl text-lg">Recipes tailored to your health conditions. Food that heals, nourishes, and connects you to ancient wisdom.</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-surface-container rounded-xl p-1.5 w-fit">
        {[{ id: 'conditions', label: '🩺 My Conditions' }, { id: 'healers', label: '🌿 Ingredient Healers' }, { id: 'planner', label: '📅 Health Meal Plan' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-5 py-2.5 rounded-lg font-label font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'conditions' && (
        <div className="space-y-8">
          {/* Condition selector */}
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Select Your Health Conditions</h2>
            <p className="text-on-surface-variant text-sm mb-6">Your recipe feed will be filtered to show only safe, beneficial recipes for your conditions.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CONDITIONS.map(condition => (
                <button
                  key={condition.id}
                  onClick={() => toggleCondition(condition.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all hover:shadow-md ${selectedConditions.includes(condition.id) ? 'border-primary bg-primary/5 shadow-md' : 'border-outline/20 bg-surface-container-lowest hover:border-primary/40'}`}
                >
                  <div className="text-3xl mb-2">{condition.icon}</div>
                  <p className="font-headline font-bold text-sm text-on-surface">{condition.label}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{condition.description}</p>
                  {selectedConditions.includes(condition.id) && (
                    <div className="mt-2 flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-[10px] font-label font-bold uppercase tracking-widest">Active</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered recipes */}
          {selectedConditions.length > 0 && (
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">
                Safe Recipes for You
                <span className="ml-3 text-sm font-body font-normal text-on-surface-variant">({recipes.length} found)</span>
              </h2>
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : recipes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recipes.map(recipe => (
                    <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="group block">
                      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline/10 hover:shadow-lg transition-all">
                        <div className="h-40 overflow-hidden bg-surface-container-high">
                          {recipe.coverImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={recipe.coverImageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🥗</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-headline font-bold text-sm text-on-surface line-clamp-2">{recipe.title}</p>
                          {recipe.region && <p className="text-xs text-on-surface-variant mt-1">{recipe.region.name}</p>}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {recipe.dietaryTags?.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[9px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-label font-bold uppercase">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-on-surface-variant">
                  <p>No recipes found for your conditions yet. More being added!</p>
                </div>
              )}
            </div>
          )}

          {selectedConditions.length === 0 && (
            <div className="text-center py-16 bg-surface-container rounded-2xl">
              <div className="text-5xl mb-4">🩺</div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Select your health conditions above</h3>
              <p className="text-on-surface-variant text-sm mt-2">We&apos;ll filter recipes to show only what&apos;s safe and beneficial for you.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'healers' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Ingredient Healers</h2>
            <p className="text-on-surface-variant text-sm mb-6">Foods that actively fight illness — connecting Ayurveda, Chinese medicine, and modern nutrition science.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INGREDIENT_HEALERS.map(healer => (
              <div key={healer.name} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline/10 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{healer.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-on-surface text-lg">{healer.name}</h3>
                    <p className="text-primary font-label font-bold text-xs uppercase tracking-widest mt-0.5">{healer.benefit}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5">science</span>
                        <p className="text-sm text-on-surface-variant">{healer.science}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-tertiary text-sm flex-shrink-0 mt-0.5">history_edu</span>
                        <p className="text-sm text-on-surface-variant italic">{healer.tradition}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {healer.conditions.map(c => (
                        <span key={c} className="text-[9px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-label font-bold uppercase">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'planner' && (
        <div className="space-y-6">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Health Meal Plan Generator</h2>
          <p className="text-on-surface-variant text-sm mb-6">AI-generated weekly meal plans based on your health conditions.</p>

          {savedConditions.length === 0 ? (
            <div className="text-center py-16 bg-surface-container rounded-2xl">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="font-headline text-xl font-bold text-on-surface">Set your health conditions first</h3>
              <p className="text-on-surface-variant text-sm mt-2 mb-6">Go to &ldquo;My Conditions&rdquo; tab and select your health profile.</p>
              <button onClick={() => setActiveTab('conditions')} className="px-6 py-3 bg-primary text-on-primary rounded-full font-label font-bold text-sm uppercase tracking-widest">
                Set Conditions
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-secondary-fixed rounded-2xl flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">info</span>
                <p className="text-sm text-on-secondary-fixed">Generating plan for: <strong>{savedConditions.map(c => CONDITIONS.find(x => x.id === c)?.label).join(', ')}</strong></p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline/10">
                    <p className="font-label font-bold text-xs uppercase tracking-widest text-primary mb-3">{day}</p>
                    <div className="space-y-2">
                      {['Breakfast', 'Lunch', 'Dinner'].map(meal => (
                        <div key={meal} className="p-2 bg-surface-container rounded-lg">
                          <p className="text-[9px] font-label font-bold uppercase text-on-surface-variant">{meal}</p>
                          <p className="text-xs text-on-surface mt-0.5 font-medium">
                            {meal === 'Breakfast' && ['Methi Paratha', 'Oats Upma', 'Moong Dal Chilla', 'Ragi Dosa', 'Poha', 'Idli Sambar', 'Sprouts Salad'][i]}
                            {meal === 'Lunch' && ['Dal Palak', 'Rajma Rice', 'Chole Roti', 'Khichdi', 'Sabzi Roti', 'Dal Tadka', 'Pulao'][i]}
                            {meal === 'Dinner' && ['Soup + Roti', 'Grilled Fish', 'Paneer Sabzi', 'Khichdi', 'Salad Bowl', 'Dal Rice', 'Stir Fry'][i]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/planner" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-label font-bold text-sm uppercase tracking-widest hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Open Full Meal Planner
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
