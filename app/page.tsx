"use client";

import Link from 'next/link';
import { useUser } from './UserContext';

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/hotel.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome to {user?.organization || "Radiate Hotels"}</h1>
          <p className="text-xl text-gray-200 mb-6">Prepare for your interview.</p>
          <Link href="/autonavigate" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition">
            Start Interview
          </Link>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Interview Preparation</h2>
            <ul className="list-disc list-inside text-lg text-gray-600 dark:text-gray-400 space-y-2">
              <li>Make sure you are in a quiet place and have a stable internet connection.</li>
              <li>The interview session will be timed, and you will have a maximum of 15 minutes to answer 10 questions.</li>
              <li>Your answers will be automatically submitted when the timer runs out.</li>
              <li>Please ensure you are well-prepared and have all necessary materials ready before starting the interview.</li>
              <li>Have a pen and paper ready for taking notes if needed.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}