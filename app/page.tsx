"use client";

import Link from 'next/link';
import { useUser } from './UserContext';

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/concert.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome {user?.fullName || "Ticketmaster"}</h1>
          <p className="text-xl text-gray-200 mb-6">Find your next event.</p>
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search for artists, venues, or events" 
              className="w-full py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
            </svg>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/event1.jpg" alt="Event 1" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Event 1</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Description of Event 1</p>
                  <Link href="/event1" className="text-blue-600 dark:text-blue-400 hover:underline">Learn More</Link>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/event2.jpg" alt="Event 2" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Event 2</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Description of Event 2</p>
                  <Link href="/event2" className="text-blue-600 dark:text-blue-400 hover:underline">Learn More</Link>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/event3.jpg" alt="Event 3" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Event 3</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Description of Event 3</p>
                  <Link href="/event3" className="text-blue-600 dark:text-blue-400 hover:underline">Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/concerts.jpg" alt="Concerts" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Concerts</h3>
                  <Link href="/concerts" className="text-blue-600 dark:text-blue-400 hover:underline">Explore Concerts</Link>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/sports.jpg" alt="Sports" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Sports</h3>
                  <Link href="/sports" className="text-blue-600 dark:text-blue-400 hover:underline">Explore Sports</Link>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/arts.jpg" alt="Arts & Theater" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Arts & Theater</h3>
                  <Link href="/arts" className="text-blue-600 dark:text-blue-400 hover:underline">Explore Arts & Theater</Link>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <img src="/family.jpg" alt="Family" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Family</h3>
                  <Link href="/family" className="text-blue-600 dark:text-blue-400 hover:underline">Explore Family</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
