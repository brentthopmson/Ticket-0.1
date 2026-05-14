import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimesCircle,
    faUserCircle,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SidebarItem {
    icon: IconDefinition;
    label: string;
    active: boolean;
    href?: string;
    action?: () => void;
}

interface SidebarProps {
    sidebarItems: SidebarItem[];
    isSidebarOpen: boolean;
    onClose: () => void;
    adminUsername: string | undefined;
}

const Sidebar: React.FC<SidebarProps> = ({
    sidebarItems,
    isSidebarOpen,
    onClose,
    adminUsername
}) => {
    return (
        <aside
            className={`fixed inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:flex-shrink-0
            w-64 bg-white transition-transform duration-300 ease-in-out
            lg:bg-white lg:rounded-2xl lg:shadow-sm lg:p-6
            `}
        >
            <div className="h-full flex flex-col">
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
                    <h2 className="text-xl font-black text-[#001B41]">Menu</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-[#001B41] transition-colors">
                        <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                    </button>
                </div>

                {/* User Info for Desktop */}
                {adminUsername && (
                    <div className="hidden lg:flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-[#89CF28]/10 text-[#89CF28] flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faUserCircle} className="text-xl" />
                        </div>
                        <div>
                            <p className="font-black text-[#001B41] text-sm">Hi, {adminUsername}</p>
                            <p className="text-xs font-bold text-gray-400">Administrator</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 lg:px-0 lg:py-0">
                    {sidebarItems.map((item, index) => (
                        item.href ? (
                            <Link key={index} href={item.href} onClick={onClose} className={`flex items-center p-3 rounded-xl transition-colors
                                ${item.active
                                    ? 'bg-[#89CF28] text-white shadow-lg shadow-[#89CF28]/20'
                                    : 'text-[#1f262d] hover:bg-gray-50'}
                            `}>
                                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                                <span className="font-bold text-sm">{item.label}</span>
                            </Link>
                        ) : (
                            <button
                                key={index}
                                onClick={() => {
                                    if (item.action) item.action();
                                    onClose();
                                }}
                                className={`flex items-center w-full text-left p-3 rounded-xl transition-colors
                                    ${item.active
                                        ? 'bg-[#89CF28] text-white shadow-lg shadow-[#89CF28]/20'
                                        : 'text-[#1f262d] hover:bg-gray-50'}
                                `}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                                <span className="font-bold text-sm">{item.label}</span>
                            </button>
                        )
                    ))}
                </nav>

                {/* Fixed bottom sign out for mobile, if not already in sidebarItems */}
                {!sidebarItems.some(item => item.label === 'Sign Out') && (
                    <div className="p-4 border-t border-gray-100 lg:hidden">
                        <button
                            onClick={onClose} // This should trigger actual logout, not just close sidebar
                            className="flex items-center w-full text-left p-3 rounded-xl transition-colors text-[#1f262d] hover:bg-red-50 hover:text-red-600"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                            <span className="font-bold text-sm">Sign Out</span>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
