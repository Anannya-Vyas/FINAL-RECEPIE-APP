'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../../lib/api';
import PaywallOverlay from '../../../../../components/PaywallOverlay';

interface LessonDetail {
  id: string;
  courseId: string;
  title: string;
  content: string;
  orderIndex: number;
  isFree: boolean;
  completed: boolean;
  completedAt: string | null;
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paywalled, setPaywalled] = useState(false);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [badgeAwarded, setBadgeAwarded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/api/academy/courses/${courseId}/lessons/${lessonId}`);
        const l: LessonDetail = data.data;
        setLesson(l);
        setCompleted(l.completed);
      } catch (err: unknown) {
        const code = (err as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error?.code;
        if (code === 'PREMIUM_REQUIRED') {
          setPaywalled(true);
        } else {
          setError('Failed to load lesson.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, lessonId]);

  async function markComplete() {
    setCompleting(true);
    try {
      const { data } = await api.post(`/api/academy/lessons/${lessonId}/complete`);
      setCompleted(true);
      if (data.data?.badgeAwarded) setBadgeAwarded(true);
    } catch {
      // silently fail
    } finally {
      setCompleting(false);
    }
  }

  async function toggleBookmark() {
    setBookmarkLoading(true);
    try {
      const { data } = await api.get(`/api/academy/lessons/${lessonId}/bookmark`);
      setBookmarked(data.data?.bookmarked ?? false);
    } catch {
      // silently fail
    } finally {
      setBookmarkLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (paywalled) {
    return <PaywallOverlay />;
  }

  if (error || !lesson) {
    return <div className="text-center py-20 text-gray-500">{error || 'Lesson not found.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href={`/academy/${courseId}`} className="text-sm text-orange-500 hover:underline mb-4 inline-block">
        ← Back to Course
      </Link>

      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Lesson {lesson.orderIndex}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{lesson.title}</h1>
        </div>
        <button
          onClick={toggleBookmark}
          disabled={bookmarkLoading}
          className={`mt-1 text-xl transition-colors ${bookmarked ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'}`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
        >
          🔖
        </button>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none mt-4 mb-8 text-gray-700 whitespace-pre-wrap">
        {lesson.content}
      </div>

      {/* Badge notification */}
      {badgeAwarded && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-amber-700 font-semibold">🏅 Course Complete! You earned a badge!</p>
        </div>
      )}

      {/* Mark complete */}
      {completed ? (
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          <span className="text-xl">✅</span> Lesson completed
          {lesson.completedAt && (
            <span className="text-gray-400 font-normal">
              · {new Date(lesson.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      ) : (
        <button
          onClick={markComplete}
          disabled={completing}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {completing ? 'Saving…' : '✓ Mark as Complete'}
        </button>
      )}
    </div>
  );
}
