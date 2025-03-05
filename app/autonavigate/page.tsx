"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';

const APP_SCRIPT_USER_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec?sheetname=user";

export default function AutoNavigatePage() {
  const router = useRouter();
  const { user, loading: userLoading, setUser } = useUser();
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (id: string) => {
    try {
      const response = await fetch(APP_SCRIPT_USER_URL);
      const data = await response.json();
      const userData = data.find((row: any) => row.userId === id);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      setTimeout(() => {
        fetchUserData(userId);
      }, 10000); // Wait for 10 seconds before fetching data
    }
  }, [fetchUserData]);

  useEffect(() => {
    if (!userLoading) {
      if (user) {
        router.push(user.route);
      } else {
        router.push('/invalid');
      }
    }
  }, [user, userLoading, router]);

  if (loading || userLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
            <span className="visually-hidden">...</span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">Please wait while we navigate you to the appropriate page.</p>
        </div>
      </main>
    );
  }

  return null;
}