"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../UserContext';
import AdminLogin from '../../../components/AdminLogin';
import UserTable from '../../../components/UserTable';
import TicketTable from '../../../components/TicketTable';
import SubAdminTable from '../../../components/SubAdminTable';
import { User, Ticket } from '../../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronRight,
    faEnvelope,
    faBell,
    faLocationDot,
    faHeart,
    faCreditCard,
    faMobileAlt,
    faQuestionCircle,
    faPen,
    faBook,
    faPaperPlane,
    faEdit,
    faChevronLeft,
    faUsers
} from '@fortawesome/free-solid-svg-icons';

export default function ManageDashboard() {
    const router = useRouter();
    const { 
        admin, 
        users: allUsers, 
        tickets: allTickets, 
        setAdmin, 
        fetchAllUsers, 
        fetchAllTickets,
    } = useUser();
    
    const [loggedInAdmin, setLoggedInAdmin] = useState<string | null>(null);
    const [users, setFilteredUsers] = useState<User[]>([]);
    const [tickets, setFilteredTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState<'transfers' | 'tickets' | 'account' | 'management'>('account');
    const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("adminToken")) {
            setIsSessionValid(false);
            return;
        }
        setIsSessionValid(true);
        const adminUsername = localStorage.getItem("loggedInAdmin");
        const adminData = localStorage.getItem('adminData');
        if (adminUsername && adminData) {
            try {
                const parsedAdminData = JSON.parse(adminData);
                setAdmin(parsedAdminData);
                setLoggedInAdmin(adminUsername);
                fetchAllUsers();
                fetchAllTickets();
            } catch (e) {
                console.error("Error parsing admin data", e);
            }
        }
    }, [setAdmin, fetchAllUsers, fetchAllTickets, setLoggedInAdmin]);


    useEffect(() => {
        if (isSessionValid === true && loggedInAdmin && Array.isArray(allUsers)) {
            const filteredUsers = allUsers.filter((u) => u.admin === loggedInAdmin);
            setFilteredUsers(filteredUsers);
        }
    }, [allUsers, loggedInAdmin, isSessionValid]);

    useEffect(() => {
        if (isSessionValid === true && loggedInAdmin && Array.isArray(allTickets)) {
            const filteredTickets = allTickets.filter((t) => t.admin === loggedInAdmin);
            setFilteredTickets(filteredTickets);
        }
    }, [allTickets, loggedInAdmin, isSessionValid]);

    useEffect(() => {
        if (isSessionValid === false) {
            router.replace('/login');
        }
    }, [isSessionValid, router]);

    if (isSessionValid === false || admin === null) {
        return <AdminLogin setLoggedInAdmin={() => {}} setUsers={() => {}} />;
    }

    const SectionHeader = ({ title }: { title: string }) => (
        <h3 className="px-5 py-3 text-[15px] font-black text-[#1F1F1F] bg-gray-50">{title}</h3>
    );

    const MenuItem = ({ icon, label, rightElement, action }: { icon?: any, label: string, rightElement?: React.ReactNode, action?: () => void }) => (
        <button 
            onClick={action}
            className="w-full flex items-center justify-between p-5 bg-white border-b border-gray-100 last:border-none active:bg-gray-50 transition-colors"
        >
            <div className="flex items-center space-x-4">
                {icon && <FontAwesomeIcon icon={icon} className="text-gray-400 text-lg w-6" />}
                <span className="text-[15px] font-bold text-[#1F1F1F]">{label}</span>
            </div>
            <div className="flex items-center space-x-2">
                {rightElement || <FontAwesomeIcon icon={faChevronRight} className="text-gray-300 text-xs" />}
            </div>
        </button>
    );

    return (
        <div className="flex-1 flex flex-col bg-gray-50 min-h-full pb-32">
            
            {activeTab !== 'account' && (
                <div className="bg-[#1F1F1F] p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center sticky top-0 z-40">
                    <div className="flex items-center mb-4 md:mb-0">
                        <button onClick={() => setActiveTab('account')} className="mr-4 text-white/40 hover:text-white transition-colors">
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h2 className="text-lg font-black text-white uppercase tracking-widest">Management</h2>
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="flex bg-white/5 rounded-lg p-1 w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('management')}
                                className={`flex-1 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'management' ? 'bg-[#026cdf] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                Stats
                            </button>
                            <button
                                onClick={() => setActiveTab('transfers')}
                                className={`flex-1 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transfers' ? 'bg-[#026cdf] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                Transfers
                            </button>
                            <button
                                onClick={() => setActiveTab('tickets')}
                                className={`flex-1 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-[#026cdf] text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                Tickets
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'account' && (
                <>
                    {/* User Profile Header - Black Background */}
                    <div className="bg-[#1F1F1F] flex flex-col items-start px-6 pt-8 pb-12">
                        <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">
                            {admin.accountName || admin.username}
                        </h2>
                        <p className="text-white/40 font-bold text-sm tracking-wide">
                            {admin.accountEmail || 'user@virtualmail.com'}
                        </p>
                    </div>

                    {/* Notifications Section */}
                    <div className="mt-[-1px]">
                        <SectionHeader title="Notifications" />
                        <div className="bg-white">
                            <MenuItem icon={faEnvelope} label="My Notifications" />
                            <MenuItem 
                                icon={faBell} 
                                label="Receive Notifications?" 
                                rightElement={
                                    <div 
                                        onClick={(e) => { e.stopPropagation(); setNotificationsEnabled(!notificationsEnabled); }}
                                        className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${notificationsEnabled ? 'bg-[#026CDF]' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${notificationsEnabled ? 'left-6' : 'left-1'}`}></div>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    {/* Location Settings Section */}
                    <div>
                        <SectionHeader title="Location Settings" />
                        <div className="bg-white">
                            <MenuItem 
                                icon={faLocationDot} 
                                label="My Location" 
                                rightElement={
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[#026CDF] font-bold text-sm">Texas</span>
                                        <FontAwesomeIcon icon={faEdit} className="text-[#026CDF] text-xs" />
                                    </div>
                                }
                            />
                            <MenuItem 
                                icon={null} 
                                label="My Country" 
                                rightElement={
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-3.5 bg-white rounded-[2px] overflow-hidden border border-gray-100 flex flex-col space-y-[0.5px] scale-125 mr-2">
                                            <div className="absolute inset-0 bg-[#002868]"></div>
                                            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#bf0a30]"></div>
                                            <div className="absolute top-0 left-0 w-full h-full flex flex-col space-y-[0.5px]">
                                                {[...Array(7)].map((_, i) => (
                                                    <div key={i} className={`h-[0.5px] w-full ${i % 2 === 0 ? 'bg-[#bf0a30]' : 'bg-white'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-[#026CDF] font-bold text-sm">United States</span>
                                        <FontAwesomeIcon icon={faEdit} className="text-[#026CDF] text-xs" />
                                    </div>
                                }
                            />
                            <MenuItem icon={faPaperPlane} label="Location" />
                        </div>
                    </div>

                    {/* More Settings */}
                    <div>
                        <SectionHeader title="Notifications" />
                        <div className="bg-white">
                            <MenuItem icon={faHeart} label="My Favourites" />
                            <MenuItem icon={faCreditCard} label="Saved Payment Methods" />
                            <MenuItem icon={faMobileAlt} label="Change App Icon" />
                        </div>
                    </div>

                    {/* Help & Guidance */}
                    <div>
                        <SectionHeader title="Help & Guidance" />
                        <div className="bg-white">
                            <MenuItem 
                                icon={faQuestionCircle} 
                                label="Need Help" 
                                action={() => setActiveTab('management')}
                            />
                            <MenuItem icon={faPen} label="Give Us Feedback" />
                            <MenuItem icon={faBook} label="Legal" />
                        </div>
                    </div>

                    {/* Sign Out */}
                    <div className="p-5 mt-4">
                        <button 
                            onClick={() => {
                                localStorage.removeItem("loggedInAdmin");
                                localStorage.removeItem("adminData");
                                localStorage.removeItem("adminToken");
                                router.push('/login');
                            }}
                            className="w-full bg-[#1F1F1F] text-red-500 py-4 rounded-xl font-black text-sm uppercase tracking-widest border border-white/5 active:bg-red-500 active:text-white transition-all shadow-lg"
                        >
                            Sign Out
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'transfers' && <div className="p-4"><UserTable users={users} tickets={tickets} /></div>}
            {activeTab === 'tickets' && <div className="p-4"><TicketTable tickets={tickets} users={users} /></div>}
            {activeTab === 'management' && (
                <div className="p-4 space-y-6">
                    {admin?.role === 'OWNER' && <SubAdminTable />}
                    <div className="bg-[#1F1F1F] p-8 rounded-2xl border border-white/5 text-center shadow-2xl">
                        <FontAwesomeIcon icon={faUsers} className="text-[#026CDF] text-5xl mb-4" />
                        <h3 className="text-white text-xl font-black uppercase tracking-tight">Management Portal</h3>
                        <p className="text-white/40 mt-2 font-bold">Manage your sub-admins, tickets and transfers from here.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
