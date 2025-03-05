import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';

const APP_SCRIPT_ADMIN_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec?sheetname=admin";
import { useUser } from '../UserContext';

interface AdminLoginProps {
  setLoggedInAdmin: (admin: string) => void;
  setUsers: (users: User[]) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ setLoggedInAdmin, setUsers }) => {
  const router = useRouter();
  const { fetchAllUsers } = useUser();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.target as any).username.value.trim();
    const password = (event.target as any).password.value.trim();

    try {
      const response = await fetch(APP_SCRIPT_ADMIN_URL);
      const data = await response.json();
      const admin = data.find((admin: any) => admin.username === username && admin.password === password);
      if (admin) {
        sessionStorage.setItem("loggedInAdmin", username);
        setLoggedInAdmin(username);
        fetchAllUsers();
        router.push('/admin');
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" name="username" placeholder="Username" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required />
          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;