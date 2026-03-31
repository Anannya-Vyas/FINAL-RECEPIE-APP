'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import RecipeCard, { Recipe } from '../../../components/RecipeCard';
import api from '../../../lib/api';

const DIETARY_TAGS = ['Vegan', 'Vegetarian', 'Gluten-free', 'Dairy-free', 'Halal'];
const PREP_TIME_OPTIONS = [
  { label: 'Any', value: '' },
  { label: '< 15 min', value: '15' },
  { label: '< 30 min', value: '30' },
  { label: '< 60 min', value: '60' },
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialRegion = searchParams.get('region') || '';

  const [query, setQuery] = useState(initialQ);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters
  const [region, setRegion] = useState(initialRegion);
  const [dietaryTag, setDietaryTag] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [minRating, setMinRating] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autocomplete
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get('/api/search/autocomplete', {
          params: { q: query },
        });
        setSuggestions(data.suggestions || data || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const runSearch = useCallback(async (q: string) => {
    setLoading(true);
    setSearched(true);
    setShowSuggestions(false);
    try {
      const { data } = await api.get('/api/search', {
        params: {
          q,
          region: region || undefined,
          dietary_tag: dietaryTag || undefined,
          prep_time_mins: prepTime || undefined,
          rating: minRating || undefined,
        },
      });
      const searchResults = data.results || data.recipes || data.hits || [];
      // If search returns nothing and we have a query, try the recipes endpoint as fallback
      if (searchResults.length === 0 && q) {
        const fallback = await api.get('/api/recipes', { params: { limit: 20 } });
        const allRecipes = fallback.data.recipes || [];
        const filtered = allRecipes.filter((r: { title: string }) => r.title.toLowerCase().includes(q.toLowerCase()));
        setResults(filtered);
      } else {
        setResults(searchResults);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [region, dietaryTag, prepTime, minRating]);

  // Auto-search on mount if query/region present
  useEffect(() => {
    if (initialQ || initialRegion) {
      runSearch(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    runSearch(query);
  }

  function selectSuggestion(s: string) {
    setQuery(s);
    setShowSuggestions(false);
    runSearch(s);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Recipes</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Search recipes, ingredients, regions…"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={() => selectSuggestion(s)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  >
                    🔍 {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-5">
            <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Region</label>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Italy"
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Dietary</label>
              <select
                value={dietaryTag}
                onChange={(e) => setDietaryTag(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              >
                <option value="">Any</option>
                {DIETARY_TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Prep time</label>
              <select
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              >
                {PREP_TIME_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Min rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400"
              >
                <option value="">Any</option>
                {[4, 3, 2].map((r) => (
                  <option key={r} value={r}>{'★'.repeat(r)}+ ({r}+)</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => runSearch(query)}
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-gray-600 font-medium mb-2">No recipes found for &quot;{query}&quot;</p>
              <p className="text-gray-400 text-sm mb-4">
                Be the first to contribute a recipe for this region!
              </p>
              <Link
                href="/recipes/create"
                className="inline-block px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Add a Recipe
              </Link>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}

          {!searched && !loading && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🌍</div>
              <p>Search for recipes, ingredients, or destinations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
