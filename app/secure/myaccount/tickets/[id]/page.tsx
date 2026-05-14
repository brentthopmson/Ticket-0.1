"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '../../../../UserContext';
import { Ticket } from '../../../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTicketAlt, 
    faUserCircle, 
    faCog, 
    faShieldAlt, 
    faQuestionCircle,
    faSignOutAlt,
    faLock,
    faChevronLeft,
    faCalendarAlt,
    faMapMarkerAlt,
    faCheckCircle,
    faInfoCircle,
    faChevronRight,
    faPaperPlane,
    faTag,
    faWallet
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import TransferModal from '../../../../components/TransferModal';

export default function TicketDetailsAccountPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;
    
    const {
        admin,
        tickets: allTickets,
        fetchAllTickets,
        setAdmin,
        setTickets
    } = useUser();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
    const [currentSeatIndex, setCurrentSeatIndex] = useState(0);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    useEffect(() => {
        const adminUsername = sessionStorage.getItem("loggedInAdmin");
        const adminData = sessionStorage.getItem('adminData');
    
        if (adminUsername && adminData) {
            try {
                const parsedAdminData = JSON.parse(adminData);
                setAdmin(parsedAdminData);
                setIsSessionValid(true);
                if (allTickets.length === 0) {
                    fetchAllTickets();
                }
            } catch (e) {
                console.error("Error parsing admin data", e);
                router.replace('/login');
            }
        } else {
            router.replace('/login');
        }
    }, [setAdmin, router, allTickets.length, fetchAllTickets]);

    useEffect(() => {
        if (isSessionValid && allTickets.length > 0) {
            // Try to find ticket by ticketId first, then fallback to sn
            const foundTicket = allTickets.find(t => t.ticketId === ticketId || t.sn === ticketId);
            if (foundTicket) {
                setTicket(foundTicket);
            }
        }
    }, [allTickets, ticketId, isSessionValid]);

    const handleLogout = () => {
        sessionStorage.removeItem("loggedInAdmin");
        sessionStorage.removeItem("adminData");
        setAdmin(null);
        setTickets([]);
        router.push('/login');
    };



    if (isSessionValid === null || !ticket) return null;

    // Parse seats for slidable view
    const seats = ticket.seatNumbers ? ticket.seatNumbers.split(',').map(s => s.trim()) : [ticket.seat || 'N/A'];

    const nextSeat = () => {
        if (currentSeatIndex < seats.length - 1) {
            setCurrentSeatIndex(prev => prev + 1);
        }
    };

    const prevSeat = () => {
        if (currentSeatIndex > 0) {
            setCurrentSeatIndex(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white text-[#001B41] border-b border-gray-100 p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center">

                        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="140" height="18" viewBox="0 0 160 25">
                                <path fill="#026CDF" d="M125.552 5.857c-4.467 0-7.747 4.033-7.747 8.225 0 4.02 2.644 5.91 6.562 5.91 1.45 0 2.958-.344 4.327-.76l.455-2.783c-1.326.6-2.727.973-4.176.973-2.264 0-3.597-.797-3.765-2.922 0-.125-.015-.242-.015-.381v-.072-.037c.015-.92.211-1.84.57-2.682.682-1.715 1.647-2.907 3.742-2.907 1.473 0 2.241.811 2.241 2.258a5.7 5.7 0 01-.08.92h-4.851c-.313 1.059-.373 1.768-.373 2.408h8.351c.205-.992.345-1.992.345-3.016-.005-3.431-2.224-5.134-5.586-5.134zm-11.895 10.096c0-.533.088-.994.161-1.314l1.295-5.903h3.181l.549-2.57h-3.179l.879-4.01-3.809 1.234-.607 2.775h-2.57l-.551 2.57h2.562l-1.002 4.565c-.241 1.074-.455 2.098-.455 3.148 0 2.602 1.693 3.543 4.096 3.543.613 0 1.296-.182 1.911-.312l.616-2.732c-.455.189-1.1.322-1.723.322-.804.001-1.354-.513-1.354-1.316zm-14.809-5.801c0 3.383 4.601 3.594 4.601 5.772 0 1.096-1.245 1.498-2.439 1.498-1.376 0-2.38-.506-3.384-1.053l-.775 2.812c1.305.6 2.725.811 4.159.811 3.04 0 6.138-1.053 6.138-4.572 0-3.295-4.599-3.93-4.599-5.632 0-1.074 1.317-1.366 2.38-1.366 1.004 0 1.979.292 2.358.497l.776-2.651c-.703-.176-2.029-.416-3.326-.416-2.799.005-5.889 1.13-5.889 4.3zm48.113 1.315c-1.413 0-2.477-1.125-2.477-2.571 0-1.453 1.062-2.57 2.477-2.57 1.398 0 2.453 1.117 2.453 2.57 0 1.446-1.055 2.571-2.453 2.571zm-.016-5.594c-1.678 0-3.047 1.352-3.047 3.023 0 1.659 1.369 3.018 3.047 3.018 1.686 0 3.055-1.359 3.055-3.018 0-1.672-1.369-3.023-3.055-3.023zM89.004 17.43c-.9 0-1.794-.469-1.794-1.41 0-2.279 2.854-2.57 4.577-2.57h1.246c-.556 2.175-1.379 3.98-4.029 3.98zm2.469-11.564c-1.59 0-3.119.284-4.636.811l-.499 2.812c1.398-.658 2.907-1.052 4.469-1.052 1.244 0 2.717.394 2.717 1.752 0 .395 0 .79-.103 1.155h-1.237c-3.332 0-8.365.352-8.365 4.807 0 2.482 1.752 3.85 4.213 3.85 1.955 0 3.179-.854 4.387-2.381h.059l-.373 2.066h2.987c.315-2.541 1.671-7.846 1.671-9.649-.001-3.178-2.566-4.171-5.29-4.171zm54.886 2.774V7.566h.703c.367 0 .726.125.726.526 0 .46-.278.548-.726.548h-.703zm2.016-.525c0-.672-.396-.993-1.225-.993h-1.362v3.542h.579V9.093h.49l.996 1.571h.623l-1.019-1.571c.552 0 .918-.408.918-.978zm-11.5.598h-.051l.476-2.549h-3.384c-.109.628-.221 1.233-.322 1.812l-2.432 11.704h3.538l1.282-6.057c.445-2.184 1.662-4.413 4.174-4.413.447 0 .953.073 1.354.212l.74-3.44c-.418-.102-.901-.131-1.354-.131-1.641.006-3.382 1.395-4.021 2.862zM79.666 5.857c-1.908 0-3.895.812-4.794 2.564h-.056c-.183-1.629-1.849-2.564-3.464-2.564-1.67 0-3.229.73-4.183 2.119h-.051l.314-1.812h-3.303c-.08.424-.189.972-.293 1.498L61.35 19.678h3.545l1.406-6.428c.442-1.812 1.109-4.668 3.512-4.668.904 0 1.67.628 1.67 1.629 0 .811-.263 2.067-.45 2.885l-1.429 6.582h3.549l1.399-6.428c.45-1.834 1.056-4.668 3.522-4.668.9 0 1.662.628 1.662 1.629 0 .811-.264 2.075-.446 2.885l-1.433 6.582h3.557l1.414-6.449c.292-1.104.607-2.471.607-3.674.003-2.054-1.747-3.698-3.769-3.698zm-68.365.308L8.394 19.68h3.541l2.912-13.515h-3.546zm7.244 7.581c0-2.541 1.585-5.164 4.416-5.164.979 0 1.904.233 2.593.679l.872-2.885c-.952-.285-2.22-.52-3.545-.52-4.893 0-8.038 3.586-8.038 8.313 0 3.49 2.273 5.822 5.79 5.822 1.164 0 2.328-.111 3.412-.629l.399-2.783c-.926.438-2.014.68-2.882.68-2.438.011-3.017-1.759-3.017-3.513zM16.146.335h-3.544l-.743 3.368h3.544l.743-3.368zm30.107 5.522c-4.472 0-7.753 4.033-7.753 8.225 0 4.02 2.644 5.91 6.562 5.91 1.454 0 2.963-.344 4.336-.76l.446-2.783c-1.322.6-2.718.973-4.175.973-2.271 0-3.596-.797-3.765-2.922h-.003c-.008-.125-.019-.242-.019-.381 0-.021.004-.051.004-.072v-.037c.015-.92.22-1.84.575-2.682.677-1.715 1.644-2.907 3.734-2.907 1.483 0 2.249.811 2.249 2.258 0 .312-.025.598-.08.92h-4.849c-.315 1.059-.37 1.768-.378 2.408h8.35c.213-.992.348-1.992.348-3.016.002-3.431-2.221-5.134-5.582-5.134zm-6.017.308h-4.601l-4.947 4.91h-.058L32.988 0h-3.545l-4.204 19.68H28.7l1.538-7.158h.051l3.52 7.158h3.996l-4.102-7.35 6.533-6.165zm16.882 9.788c0-.533.08-.994.161-1.314l1.293-5.903h3.179l.557-2.57h-3.176l.876-4.01-3.81 1.234-.614 2.775h-2.56l-.561 2.57h2.566l-1 4.565c-.241 1.074-.453 2.098-.453 3.148 0 2.602 1.695 3.543 4.101 3.543.608 0 1.297-.182 1.905-.312l.607-2.732c-.45.189-1.08.322-1.721.322-.79.001-1.35-.513-1.35-1.316zm-52.46 0c0-.533.084-.994.157-1.314l1.297-5.903H9.29l.557-2.57H6.668l.875-4.01L3.735 3.39l-.612 2.776H.556L0 8.736h2.57l-1.006 4.565c-.238 1.072-.455 2.098-.455 3.148 0 2.6 1.696 3.543 4.106 3.543.607 0 1.296-.184 1.903-.314l.608-2.732c-.446.189-1.084.322-1.717.322-.794.002-1.351-.512-1.351-1.315z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="hidden md:block text-sm font-bold uppercase tracking-wider text-gray-500">Hi, {admin?.username}</span>
                        <button onClick={handleLogout} className="text-sm font-black text-[#001B41] hover:text-[#026CDF] transition-colors flex items-center">
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col py-8 px-4 gap-8">
                {/* Main Content */}
                <main className="flex-1">
                    <button 
                        onClick={() => router.push("/secure/myaccount/tickets")}
                        className="flex items-center text-[#001B41] font-black mb-8 hover:opacity-70 transition-opacity"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                        Back to My Purchases
                    </button>

                    {/* Sliding Ticket Section */}
                    <div className="max-w-md mx-auto relative">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#026CDF]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#001B41]/5 rounded-full blur-3xl"></div>

                        <div className="relative overflow-hidden rounded-[32px] shadow-2xl bg-white border border-gray-100">
                            {/* Static Top Info */}
                            <div className="bg-[#001B41] p-6 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="bg-[#026CDF] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Confirmed
                                    </div>
                                    <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                        Ticket {currentSeatIndex + 1} of {seats.length}
                                    </div>
                                </div>
                                <h1 className="text-xl font-black mb-1 line-clamp-1">{ticket.eventName}</h1>
                                <p className="text-white/70 text-xs font-bold truncate">{ticket.venue}</p>
                                <p className="text-white/70 text-[10px] font-bold mt-1 uppercase tracking-wider">{ticket.dateTime}</p>
                            </div>

                            {/* Slidable Area */}
                            <div className="relative">
                                <div 
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentSeatIndex * 100}%)` }}
                                >
                                    {seats.map((seatNum: string, idx: number) => (
                                        <div key={idx} className="min-w-full p-8 text-center">
                                            {/* Seat Details */}
                                            <div className="grid grid-cols-3 gap-4 mb-8">
                                                <div className="bg-gray-50 rounded-2xl p-4">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Section</p>
                                                    <p className="text-lg font-black text-[#001B41]">{ticket.section}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-2xl p-4">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Row</p>
                                                    <p className="text-lg font-black text-[#001B41]">{ticket.row}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-2xl p-4">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Seat</p>
                                                    <p className="text-lg font-black text-[#026CDF]">{seatNum}</p>
                                                </div>
                                            </div>

                                            {/* Simulated Barcode Area */}
                                            <div className="mb-8 p-6 bg-white border-2 border-dashed border-gray-100 rounded-3xl">
                                                <div className="flex justify-center space-x-1 h-20 mb-4">
                                                    {Array.from({length: 45}).map((_, i) => (
                                                        <div 
                                                            key={i} 
                                                            className="h-full bg-black rounded-full" 
                                                            style={{
                                                                width: `${Math.random() * 3 + 1}px`, 
                                                                opacity: Math.random() > 0.1 ? 1 : 0.1
                                                            }}
                                                        ></div>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] font-mono font-black text-gray-400 tracking-[0.3em]">
                                                    {ticket.ticketId.toUpperCase()}-{idx + 1}
                                                </p>
                                            </div>

                                            <div className="bg-[#026CDF]/5 py-3 rounded-2xl mb-4 border border-[#026CDF]/10">
                                                <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-[#026CDF] uppercase tracking-widest">
                                                    <FontAwesomeIcon icon={faLock} />
                                                    <span>Verified Secure Ticket</span>
                                                </div>
                                            </div>

                                            {ticket.paymentSettings && (() => {
                                                try {
                                                    const settings = JSON.parse(ticket.paymentSettings);
                                                    return (
                                                        <div className="w-full space-y-3 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center mb-1">Payment Options</p>
                                                            
                                                            {/* Apple Pay */}
                                                            {settings.applePayNumber && (
                                                                <a 
                                                                    href={`sms:${settings.applePayNumber}?body=Hi, I would like to add my tickets for ${ticket.eventName} to my Apple Wallet. UserID: ${ticket.ticketId}`}
                                                                    className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center shadow-lg active:scale-95 transition-all"
                                                                >
                                                                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                                                                    Add to Apple Wallet
                                                                </a>
                                                            )}

                                                            {/* Crypto Wallets */}
                                                            {settings.cryptoWallets && (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    {settings.cryptoWallets.btc && (
                                                                        <a 
                                                                            href={`bitcoin:${settings.cryptoWallets.btc}`}
                                                                            className="flex flex-col items-center justify-center p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
                                                                        >
                                                                            <span className="text-[9px] font-black text-[#f7931a] mb-0.5">BTC</span>
                                                                            <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-[10px]" />
                                                                        </a>
                                                                    )}
                                                                    {settings.cryptoWallets.eth && (
                                                                        <a 
                                                                            href={`ethereum:${settings.cryptoWallets.eth}`}
                                                                            className="flex flex-col items-center justify-center p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
                                                                        >
                                                                            <span className="text-[9px] font-black text-[#627eea] mb-0.5">ETH</span>
                                                                            <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-[10px]" />
                                                                        </a>
                                                                    )}
                                                                    {settings.cryptoWallets.usdt && (
                                                                        <div 
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(settings.cryptoWallets.usdt || '');
                                                                                alert('USDT Address copied to clipboard!');
                                                                            }}
                                                                            className="flex flex-col items-center justify-center p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                                                                        >
                                                                            <span className="text-[9px] font-black text-[#26a17b] mb-0.5">USDT</span>
                                                                            <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-[10px]" />
                                                                        </div>
                                                                    )}
                                                                    {settings.cryptoWallets.trc && (
                                                                        <div 
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(settings.cryptoWallets.trc || '');
                                                                                alert('TRC Address copied to clipboard!');
                                                                            }}
                                                                            className="flex flex-col items-center justify-center p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                                                                        >
                                                                            <span className="text-[9px] font-black text-[#ff0013] mb-0.5">TRC</span>
                                                                            <FontAwesomeIcon icon={faWallet} className="text-gray-400 text-[10px]" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                } catch (e) {
                                                    console.error("Error parsing payment settings", e);
                                                    return null;
                                                }
                                            })()}

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3 mb-6">
                                                <button 
                                                    onClick={() => setIsTransferModalOpen(true)}
                                                    className="flex-1 bg-[#001B41] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-[#001B41]/10 hover:scale-[1.02] transition-transform active:scale-95 flex items-center justify-center"
                                                >
                                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                                                    Transfer
                                                </button>
                                                <button 
                                                    onClick={() => window.open('https://www.ticketmaster.com/sell', '_blank')}
                                                    className="flex-1 bg-white text-[#001B41] border-2 border-gray-100 py-4 rounded-2xl font-black text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                                                >
                                                    <FontAwesomeIcon icon={faTag} className="mr-2" />
                                                    Sell
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                {seats.length > 1 && (
                                    <>
                                        {currentSeatIndex > 0 && (
                                            <button 
                                                onClick={prevSeat}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-[#001B41] z-10 hover:bg-white transition-all"
                                            >
                                                <FontAwesomeIcon icon={faChevronLeft} />
                                            </button>
                                        )}
                                        {currentSeatIndex < seats.length - 1 && (
                                            <button 
                                                onClick={nextSeat}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-[#001B41] z-10 hover:bg-white transition-all"
                                            >
                                                <FontAwesomeIcon icon={faChevronRight} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Dot Indicators */}
                            {seats.length > 1 && (
                                <div className="flex justify-center space-x-2 pb-6">
                                    {seats.map((_: any, idx: number) => (
                                        <div 
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${currentSeatIndex === idx ? 'w-6 bg-[#026CDF]' : 'w-1.5 bg-gray-200'}`}
                                        ></div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Guarantee Card */}
                        <div className="mt-8 bg-[#026CDF] rounded-[24px] p-6 text-white shadow-xl shadow-[#026CDF]/20 flex items-start">
                            <div className="bg-white/20 p-3 rounded-xl mr-4">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-black text-sm mb-1 uppercase tracking-wider">FanProtect™ Guarantee</h4>
                                <p className="text-[10px] font-bold text-white/80 leading-relaxed">
                                    Your order is covered. We guarantee you'll get valid tickets in time for the event.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">© {new Date().getFullYear()} Ticketmaster. Secure Ticket System.</p>
                </div>
            </footer>

            {/* Bottom-Up Transfer Modal */}
            <TransferModal 
                isOpen={isTransferModalOpen} 
                onClose={() => setIsTransferModalOpen(false)} 
                ticket={ticket}
            />
        </div>
    );
}
