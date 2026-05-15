"use client";

import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, 
    faTicketAlt, 
    faHeart, 
    faUserCircle,
    faChevronLeft,
    faUser
} from '@fortawesome/free-solid-svg-icons';

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const pathParts = pathname.split('/').filter(Boolean);
    const isDetailView = pathParts.length > 3;
    
    const isTicketsList = pathname.endsWith('/tickets');
    const isTransfers = pathname.endsWith('/transfers');
    const isManage = pathname.endsWith('/manage');

    return (
        <div className="min-h-screen bg-black flex flex-col font-sans">
            {/* Shared Mobile Header - FIXED for app-like feel */}
            {!isDetailView && (
                <header className="bg-[#1F1F1F] text-white px-4 pt-10 pb-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 shadow-xl">
                    <div className="w-12">
                        {pathParts.length > 3 && !isTicketsList && !isTransfers && !isManage && (
                            <button onClick={() => router.back()} className="text-white hover:text-white/80 transition-colors">
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <h1 className="text-base font-bold text-white">
                            {isTicketsList ? 'My Events' : isTransfers ? 'Transfers' : 'My Account'}
                        </h1>
                        {isTicketsList && (
                            <div className="w-6 h-4 bg-white rounded-sm overflow-hidden border border-white/20 scale-75">
                                <div className="absolute inset-0 bg-[#002868]"></div>
                                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#bf0a30]"></div>
                                <div className="absolute top-0 left-0 w-full h-full flex flex-col space-y-[0.5px]">
                                    {[...Array(7)].map((_, i) => (
                                        <div key={i} className={`h-[0.5px] w-full ${i % 2 === 0 ? 'bg-[#bf0a30]' : 'bg-white'}`}></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-12 flex justify-end">
                        {(isTicketsList || isTransfers) ? (
                            <button className="text-sm font-bold text-white/80">Help</button>
                        ) : isManage ? (
                            <div className="w-10"></div>
                        ) : (
                            <button onClick={() => router.push('/secure/myaccount/manage')} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white">
                                <FontAwesomeIcon icon={faUser} className="text-sm" />
                            </button>
                        )}
                    </div>
                </header>
            )}

            <div className={`flex-1 flex flex-col ${!isDetailView ? 'pt-[76px]' : ''}`}>
                {children}
            </div>

            {/* Global Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-[100] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                <button onClick={() => router.push('/')} className={`flex flex-col items-center space-y-1 ${pathname === '/' ? 'text-[#026CDF]' : 'text-gray-400'}`}>
                    <FontAwesomeIcon icon={faSearch} className="text-xl" />
                    <span className="text-[10px] font-bold">Discover</span>
                </button>
                <button onClick={() => router.push('/secure/myaccount/transfers')} className={`flex flex-col items-center space-y-1 ${pathname.includes('/transfers') ? 'text-[#026CDF]' : 'text-gray-400'}`}>
                    <FontAwesomeIcon icon={faHeart} className="text-xl" />
                    <span className="text-[10px] font-bold">Favorites</span>
                </button>
                <button onClick={() => router.push('/secure/myaccount/tickets')} className={`flex flex-col items-center space-y-1 ${pathname.includes('/tickets') ? 'text-[#026CDF]' : 'text-gray-400'}`}>
                    <FontAwesomeIcon icon={faTicketAlt} className="text-xl" />
                    <span className="text-[10px] font-bold">My Tickets</span>
                </button>
                <button onClick={() => router.push('/secure/myaccount/manage')} className={`flex flex-col items-center space-y-1 ${pathname.includes('/manage') || pathname.includes('/personal-details') ? 'text-[#026CDF]' : 'text-gray-400'}`}>
                    <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                    <span className="text-[10px] font-bold">My Account</span>
                </button>
            </nav>
        </div>
    );
}
