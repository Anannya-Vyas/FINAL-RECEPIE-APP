'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string | null;
  isPremium: boolean;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'cooking', label: '🍳 Cooking' },
  { value: 'gardening', label: '🌱 Gardening' },
];

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/api/academy/courses');
        setCourses(data.data || []);
      } catch {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = category
    ? courses.filter((c) => c.category?.toLowerCase().includes(category))
    : courses;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🎓 Culinary Academy</h1>
        <p className="text-gray-500 text-sm mt-1">
          Build your cooking and gardening skills step by step.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === value
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500 text-sm">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p>No courses found.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            {course.category}
          </span>
          {course.isPremium && (
            <span className="ml-2 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              ✨ Premium
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{course.totalLessons} lessons</span>
      </div>

      <h3 className="font-semibold text-gray-900 mt-2 mb-1">{course.title}</h3>
      {course.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
      )}

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{course.completedLessons}/{course.totalLessons} completed</span>
          <span>{course.progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full transition-all"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
      </div>

      <Link
        href={`/academy/${course.id}`}
        className="block text-center py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
      >
        {course.progressPercent > 0 ? 'Continue' : 'Start Course'}
      </Link>
    </div>
  );
}
