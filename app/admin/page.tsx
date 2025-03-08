"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import AdminLogin from '../components/AdminLogin';
import UserTable from '../components/UserTable';
import TicketTable from '../components/TicketTable';
import { User, Ticket } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTicketAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboard() {
  const [loggedInAdmin, setLoggedInAdmin] = useState<string | null>(null);
  const { users: allUsers, tickets: allTickets, fetchAllUsers, fetchAllTickets } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('users');

  useEffect(() => {
    const admin = sessionStorage.getItem("loggedInAdmin");
    if (admin) {
      setLoggedInAdmin(admin);
      fetchAllUsers();
      fetchAllTickets();
    }
  }, [fetchAllUsers, fetchAllTickets]);

  useEffect(() => {
    if (Array.isArray(allUsers) && allUsers.length > 0) {
      const admin = sessionStorage.getItem("loggedInAdmin");
      if (admin) {
        const filteredUsers = allUsers.filter(u => u.admin === admin);
        setUsers(filteredUsers);
      }
    }
  }, [allUsers]);

  useEffect(() => {
    if (Array.isArray(allTickets) && allTickets.length > 0) {
      const admin = sessionStorage.getItem("loggedInAdmin");
      if (admin) {
        const filteredTickets = allTickets.filter(t => t.admin === admin);
        setTickets(filteredTickets);
      }
    }
  }, [allTickets]);

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInAdmin");
    setLoggedInAdmin(null);
  };

  if (!loggedInAdmin) {
    return <AdminLogin setLoggedInAdmin={setLoggedInAdmin} setUsers={setUsers} />;
  }

  return (
    <main className="p-4 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with tabs */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Admin Dashboard
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2 rounded-md flex items-center ${activeTab === 'tickets' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
                <span>Tickets</span>
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Content area */}
        {activeTab === 'users' ? (
          <UserTable users={users} tickets={tickets} />
        ) : (
          <TicketTable tickets={tickets} users={users} />
        )}
      </div>
    </main>
  );
}
