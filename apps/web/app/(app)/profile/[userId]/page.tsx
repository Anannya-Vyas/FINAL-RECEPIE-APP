'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import RecipeCard, { Recipe } from '../../../../components/RecipeCard';
import api from '../../../../lib/api';
import { getToken, isTokenExpired } from '../../../../lib/auth';

interface Badge {
  id: string;
  name: string;
  icon: string;
  awardedAt: string;
}

interface PassportRegion {
  id: string;
  name: string;
}

interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  recipes: Recipe[];
  badges: Badge[];
  savedRecipes: Recipe[];
  subscriptionStatus?: string;
  nextBillingDate?: string;
  isOwnProfile?: boolean;
  passport?: PassportRegion[];
}

function isOwnProfile(userId: string): boolean {
  const token = getToken();
  if (!token || isTokenExpired(token)) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub === userId || payload.userId === userId;
  } catch {
    return false;
  }
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'saved' | 'badges'>('recipes');
  const own = isOwnProfile(userId);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, passportRes] = await Promise.all([
          api.get(`/api/profile/${userId}`),
          api.get(`/api/profile/${userId}/passport`).catch(() => ({ data: [] })),
        ]);
        setProfile({
          ...profileRes.data,
          passport: passportRes.data?.regions || passportRes.data || [],
          isOwnProfile: own,
        });
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
          setError('This profile is private.');
        } else {
          setError('Failed to load profile.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, own]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-5xl mb-3">🔒</div>
        <p>{error || 'Profile not found.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center text-3xl font-bold text-orange-700 flex-shrink-0 overflow-hidden">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              profile.displayName?.[0]?.toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{profile.displayName}</h1>
            {profile.bio && <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>}
            <div className="flex gap-4 mt-3">
              <div className="text-center">
                <p className="font-bold text-gray-900">{profile.followerCount || 0}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{profile.followingCount || 0}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">{profile.recipes?.length || 0}</p>
                <p className="text-xs text-gray-500">Recipes</p>
              </div>
            </div>
          </div>
          {own && (
            <Link
              href="/settings"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* Subscription info (own profile only) */}
        {own && profile.subscriptionStatus && (
          <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Subscription:{' '}
                  <span className="capitalize text-orange-600">{profile.subscriptionStatus}</span>
                </p>
                {profile.nextBillingDate && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    Next billing: {new Date(profile.nextBillingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {profile.subscriptionStatus === 'active' && (
                <button className="text-xs text-red-500 hover:text-red-700">
                  Cancel
                </button>
              )}
              {(profile.subscriptionStatus === 'trial' || profile.subscriptionStatus === 'cancelled') && (
                <Link
                  href="/subscribe"
                  className="text-xs bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Subscribe
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Culinary Passport */}
      {profile.passport && profile.passport.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-3">🗺️ Culinary Passport</h2>
          <p className="text-sm text-gray-500 mb-3">
            Regions explored: {profile.passport.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.passport.map((r) => (
              <Link
                key={r.id}
                href={`/search?region=${encodeURIComponent(r.id)}`}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors"
              >
                📍 {r.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {(['recipes', 'saved', 'badges'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'recipes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.recipes?.length > 0 ? (
            profile.recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
          ) : (
            <p className="text-gray-400 text-sm col-span-2 text-center py-8">No recipes yet.</p>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.savedRecipes?.length > 0 ? (
            profile.savedRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
          ) : (
            <p className="text-gray-400 text-sm col-span-2 text-center py-8">No saved recipes.</p>
          )}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {profile.badges?.length > 0 ? (
            profile.badges.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-4xl mb-2">{b.icon || '🏅'}</div>
                <p className="text-sm font-medium text-gray-800">{b.name}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(b.awardedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm col-span-3 text-center py-8">No badges yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
