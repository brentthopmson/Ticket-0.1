"use client";

import { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import AdminLogin from '../components/AdminLogin';
import UserTable from '../components/UserTable';
import { User } from '../types';

export default function AdminDashboard() {
  const [loggedInAdmin, setLoggedInAdmin] = useState<string | null>(null);
  const { users: allUsers } = useUser();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const admin = sessionStorage.getItem("loggedInAdmin");
    if (admin) {
      setLoggedInAdmin(admin);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(allUsers) && allUsers.length > 0) {
      const admin = sessionStorage.getItem("loggedInAdmin");
      if (admin) {
        const filteredUsers = allUsers.filter(u => u.admin === admin);
        setUsers(filteredUsers);
      }
    }
  }, [allUsers]);

  if (!loggedInAdmin) {
    return <AdminLogin setLoggedInAdmin={setLoggedInAdmin} setUsers={setUsers} />;
  }

  return (
    <main className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <UserTable users={users} />
    </main>
  );
}