'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';

interface Lesson {
  id: string;
  title: string;
  orderIndex: number;
  isFree: boolean;
}

interface CourseDetail {
  id: string;
  title: string;
  category: string;
  description: string | null;
  isPremium: boolean;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  lessons?: Lesson[];
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/api/academy/courses');
        const found = (data.data as CourseDetail[]).find((c) => c.id === courseId);
        if (found) setCourse(found);
        else setError('Course not found.');
      } catch {
        setError('Failed to load course.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return <div className="text-center py-20 text-gray-500">{error || 'Course not found.'}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/academy" className="text-sm text-orange-500 hover:underline mb-4 inline-block">
        ← Back to Academy
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{course.description}</p>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{course.completedLessons}/{course.totalLessons} completed</span>
          <span>{course.progressPercent}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-400 italic">
        Select a lesson from the Academy page to begin.
      </p>
    </div>
  );
}
