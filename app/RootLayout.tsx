"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLock, faTicketAlt, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { UserProvider, useUser } from './UserContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';

library.add(faPhone, faLock, faTicketAlt, faUser, faSearch);

export default function RootLayout({
  children,
  inter,
}: {
  children: React.ReactNode;
  inter: { className: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const [loggedInAdmin, setLoggedInAdmin] = useState<string | null>(null);

  useEffect(() => {
    const admin = sessionStorage.getItem("loggedInAdmin");
    if (admin) {
      setLoggedInAdmin(admin);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInAdmin");
    setLoggedInAdmin(null);
    router.push('/');
  };

  // Conditionally render header and footer if the pathname is not '/account' or '/invalid'
  const shouldShowHeaderFooter = pathname !== '/account' && pathname !== '/invalid';

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f5f5f5]`}>
        <UserProvider>
          {shouldShowHeaderFooter && (
            <>
              {/* Ticketmaster-styled header */}
              <header className="fixed top-0 left-0 right-0 z-10 bg-[#026CDF] shadow-md">
                {/* Top navigation bar */}
                <div className="bg-[#001B41] text-white py-1 px-4">
                  <div className="container mx-auto flex justify-end items-center text-xs">
                    <Link href="/help" className="mr-4 hover:underline">Help</Link>
                    <Link href="/my-account" className="flex items-center hover:underline">
                      <FontAwesomeIcon icon={faUser} className="mr-1" />
                      My Account
                    </Link>
                  </div>
                </div>
                
                {/* Main header */}
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                  {/* Logo */}
                  <Link href="/" className="flex items-center">
                    <div className="text-white font-bold text-2xl">
                      <span className="text-white">ticket</span>
                      <span className="text-white">master</span>
                    </div>
                  </Link>
                  
                  {/* Navigation */}
                  <div className="hidden lg:flex items-center space-x-6 text-white">
                    <Link href="/concerts" className="hover:text-[#F5A623] font-medium">Concerts</Link>
                    <Link href="/sports" className="hover:text-[#F5A623] font-medium">Sports</Link>
                    <Link href="/arts" className="hover:text-[#F5A623] font-medium">Arts & Theater</Link>
                    <Link href="/family" className="hover:text-[#F5A623] font-medium">Family</Link>
                    <Link href="/more" className="hover:text-[#F5A623] font-medium">More</Link>
                    
                    {loggedInAdmin ? (
                      <button onClick={handleLogout} className="bg-[#F5A623] text-[#001B41] px-4 py-2 rounded font-medium hover:bg-[#f7b84c] transition">
                        Logout
                      </button>
                    ) : (
                      <Link href="/signin" className="bg-[#F5A623] text-[#001B41] px-4 py-2 rounded font-medium hover:bg-[#f7b84c] transition">
                        Sign In
                      </Link>
                    )}
                  </div>
                  
                  {/* Mobile menu */}
                  <div className="lg:hidden flex items-center">
                    <button className="text-white p-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Search bar */}
                <div className="bg-white py-3 px-4 shadow-sm">
                  <div className="container mx-auto">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for artists, venues, or events" 
                        className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#026CDF]"
                      />
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </header>
            </>
          )}

          {/* Main Content */}
          <main className={shouldShowHeaderFooter ? "pt-36 z-0" : ""}>
            {children}
          </main>

          {shouldShowHeaderFooter && (
            <footer className="bg-[#001B41] text-white py-12 mt-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Help & Support</h3>
                    <ul className="space-y-2">
                      <li><Link href="/help" className="hover:text-[#F5A623]">Help Center</Link></li>
                      <li><Link href="/faq" className="hover:text-[#F5A623]">FAQs</Link></li>
                      <li><Link href="/contact" className="hover:text-[#F5A623]">Contact Us</Link></li>
                      <li><Link href="/accessibility" className="hover:text-[#F5A623]">Accessibility</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">My Account</h3>
                    <ul className="space-y-2">
                      <li><Link href="/account" className="hover:text-[#F5A623]">My Tickets</Link></li>
                      <li><Link href="/account/favorites" className="hover:text-[#F5A623]">Favorites</Link></li>
                      <li><Link href="/account/settings" className="hover:text-[#F5A623]">Account Settings</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Discover</h3>
                    <ul className="space-y-2">
                      <li><Link href="/gift-cards" className="hover:text-[#F5A623]">Gift Cards</Link></li>
                      <li><Link href="/vip" className="hover:text-[#F5A623]">VIP Access</Link></li>
                      <li><Link href="/deals" className="hover:text-[#F5A623]">Deals & Promotions</Link></li>
                      <li><Link href="/groups" className="hover:text-[#F5A623]">Groups & Packages</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                    <div className="flex space-x-4 mb-6">
                      <a href="#" className="text-white hover:text-[#F5A623]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#F5A623]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-[#F5A623]">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Get the Ticketmaster App</h4>
                      <div className="flex space-x-2">
                        <a href="#" className="block">
                          <img src="https://placehold.co/120x40/001B41/FFFFFF?text=App+Store" alt="App Store" className="h-10" />
                        </a>
                        <a href="#" className="block">
                          <img src="https://placehold.co/120x40/001B41/FFFFFF?text=Google+Play" alt="Google Play" className="h-10" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <p>&copy; {new Date().getFullYear()} Ticketmaster. All rights reserved.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link href="/terms" className="hover:text-[#F5A623]">Terms of Use</Link>
                      <Link href="/privacy" className="hover:text-[#F5A623]">Privacy Policy</Link>
                      <Link href="/cookies" className="hover:text-[#F5A623]">Cookie Choices</Link>
                      <Link href="/ca-privacy" className="hover:text-[#F5A623]">CA Privacy Rights</Link>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </UserProvider>
      </body>
    </html>
  );
}
