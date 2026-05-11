"use client";

import Link from 'next/link';
import { useUser } from './UserContext';

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1974)' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Welcome {user?.fullName || "Ticketmaster"}</h1>
          <p className="text-xl text-gray-200 mb-6">Find your next event.</p>
          <div className="relative w-full max-w-md px-4">
            <input 
              type="text" 
              placeholder="Search for artists, venues, or events" 
              className="w-full py-3 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#026CDF]"
            />
            <svg className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 15z" />
            </svg>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" alt="Concerts" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upcoming Concerts</h3>
                  <p className="text-gray-600 mb-4">Experience live music from your favorite artists.</p>
                  <button className="text-[#026CDF] font-bold hover:underline">Learn More</button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800" alt="Sports" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Major Sports Events</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Don't miss the biggest games of the season.</p>
                  <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Learn More</button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=800" alt="Theater" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Arts & Theater</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Discover captivating performances and shows.</p>
                  <button className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400" alt="Concerts" className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Concerts</h3>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Explore Concerts</button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" alt="Sports" className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Sports</h3>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Explore Sports</button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=400" alt="Arts" className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Arts & Theater</h3>
                  <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Explore Arts</button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1472653431158-6364773b2a56?auto=format&fit=crop&q=80&w=400" alt="Family" className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Family</h3>
                  <button className="text-[#026CDF] text-sm hover:underline">Explore Family</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
