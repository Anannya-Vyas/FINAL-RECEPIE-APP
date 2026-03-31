'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../../lib/auth';

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.sub || payload.userId;
      if (userId) {
        router.replace(`/profile/${userId}`);
      } else {
        router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
