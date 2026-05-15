"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../UserContext';
import AdminLogin from '../../../components/AdminLogin';
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
    faEdit
} from '@fortawesome/free-solid-svg-icons';

export default function ManageDashboard() {
    const router = useRouter();
    const { admin, setAdmin, fetchAllUsers, fetchAllTickets } = useUser();
    const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        const adminUsername = sessionStorage.getItem("loggedInAdmin");
        const adminData = sessionStorage.getItem('adminData');
    
        if (adminUsername && adminData) {
            try {
                const parsedAdminData = JSON.parse(adminData);
                setAdmin(parsedAdminData);
                setIsSessionValid(true);
                fetchAllUsers();
                fetchAllTickets();
            } catch (e) {
                console.error("Error parsing admin data", e);
                setIsSessionValid(false);
            }
        } else {
            setIsSessionValid(false);
        }
    }, [setAdmin, fetchAllUsers, fetchAllTickets]);

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
                    <MenuItem icon={faQuestionCircle} label="Need Help" />
                    <MenuItem icon={faPen} label="Give Us Feedback" />
                    <MenuItem icon={faBook} label="Legal" />
                </div>
            </div>

            {/* Sign Out */}
            <div className="p-5 mt-4">
                <button 
                    onClick={() => {
                        sessionStorage.removeItem("loggedInAdmin");
                        sessionStorage.removeItem("adminData");
                        router.push('/login');
                    }}
                    className="w-full bg-[#1F1F1F] text-red-500 py-4 rounded-xl font-black text-sm uppercase tracking-widest border border-white/5 active:bg-red-500 active:text-white transition-all shadow-lg"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
