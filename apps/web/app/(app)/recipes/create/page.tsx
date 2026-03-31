'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';

const DIETARY_TAGS = [
  'Vegan', 'Vegetarian', 'Gluten-free', 'Dairy-free',
  'Nut-free', 'Diabetic-friendly', 'Halal',
];

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Step {
  description: string;
}

export default function RecipeCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [prepTimeMins, setPrepTimeMins] = useState('');
  const [cookTimeMins, setCookTimeMins] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [isFamilyRecipe, setIsFamilyRecipe] = useState(false);
  const [dietaryTags, setDietaryTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: '' },
    { name: '', quantity: '', unit: '' },
    { name: '', quantity: '', unit: '' },
  ]);
  const [steps, setSteps] = useState<Step[]>([
    { description: '' },
    { description: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function toggleTag(tag: string) {
    setDietaryTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function updateIngredient(i: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { name: '', quantity: '', unit: '' }]);
  }

  function removeIngredient(i: number) {
    if (ingredients.length <= 3) return;
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateStep(i: number, value: string) {
    setSteps((prev) => prev.map((s, idx) => idx === i ? { description: value } : s));
  }

  function addStep() {
    setSteps((prev) => [...prev, { description: '' }]);
  }

  function removeStep(i: number) {
    if (steps.length <= 2) return;
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/recipes', {
        title,
        region_id: region,
        cover_image_url: coverImageUrl,
        prep_time_mins: Number(prepTimeMins) || null,
        cook_time_mins: Number(cookTimeMins) || null,
        servings: Number(servingSize) || null,
        is_family_recipe: isFamilyRecipe,
        dietary_tags: dietaryTags,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps
          .filter((s) => s.description.trim())
          .map((s, idx) => ({ order: idx + 1, text: s.description })),
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to submit recipe.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe submitted!</h2>
        <p className="text-gray-500 mb-6">
          Your recipe is under review and will be published once approved.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recipe Creator Studio</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. Grandma's Biryani"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region / Country *</label>
            <input
              required
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. India, Hyderabad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL *</label>
            <input
              required
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prep (min)</label>
              <input
                type="number"
                min="0"
                value={prepTimeMins}
                onChange={(e) => setPrepTimeMins(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cook (min)</label>
              <input
                type="number"
                min="0"
                value={cookTimeMins}
                onChange={(e) => setCookTimeMins(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                min="1"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          {/* Family Recipe toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsFamilyRecipe((v) => !v)}
              className={`w-10 h-6 rounded-full transition-colors ${
                isFamilyRecipe ? 'bg-amber-500' : 'bg-gray-300'
              } relative`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isFamilyRecipe ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              👵 Family / Grandmother Recipe
            </span>
          </label>
        </div>

        {/* Dietary tags */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Dietary Tags</h2>
          <div className="flex flex-wrap gap-2">
            {DIETARY_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  dietaryTags.includes(tag)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Ingredients (min. 3) *</h2>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(i, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, 'unit', e.target.value)}
                  placeholder="Unit"
                  className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <input
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                  placeholder="Ingredient name"
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  disabled={ingredients.length <= 3}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-30 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            + Add ingredient
          </button>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Steps (min. 2) *</h2>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-sm font-bold flex items-center justify-center mt-1">
                  {i + 1}
                </span>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(i, e.target.value)}
                  rows={2}
                  placeholder={`Step ${i + 1} description…`}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  disabled={steps.length <= 2}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-30 text-lg mt-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            + Add step
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit Recipe for Review'}
        </button>
      </form>
    </div>
  );
}
