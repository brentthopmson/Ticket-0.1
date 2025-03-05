import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from './types'; // Import the User interface

const APP_SCRIPT_USER_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec?sheetname=user";

interface UserContextProps {
  user: User | null;
  users: User[];
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  fetchAllUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({ user: null, users: [], loading: true, setUser: () => {}, setUsers: () => {}, fetchAllUsers: async () => {} });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchUserData = async (id: string) => {
    try {
      const response = await fetch(APP_SCRIPT_USER_URL);
      const data: User[] = await response.json();
      const userData = data.find((row: User) => row.userId === id);
      if (userData) {
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData)); // Cache user data
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(APP_SCRIPT_USER_URL);
      const data: User[] = await response.json();
      setUsers(data);
      localStorage.setItem('allUsersData', JSON.stringify(data)); // Cache all users data
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    const cachedId = localStorage.getItem('userId');
    const cachedUserData = localStorage.getItem('userData');
    const cachedAllUsersData = localStorage.getItem('allUsersData');
    const currentPath = window.location.pathname;

    if (cachedUserData) {
      try {
        setUser(JSON.parse(cachedUserData));
      } catch (e) {
        console.error("Error parsing cached user data", e);
        localStorage.removeItem('userData');
      }
    }

    if (cachedAllUsersData) {
      try {
        setUsers(JSON.parse(cachedAllUsersData));
      } catch (e) {
        console.error("Error parsing cached all users data", e);
        localStorage.removeItem('allUsersData');
      }
    }

    if (idFromUrl) {
      localStorage.setItem('userId', idFromUrl);
      fetchUserData(idFromUrl);
    } else if (cachedId) {
      fetchUserData(cachedId);
    } else if (!currentPath.startsWith('/admin')) {
      router.push('/invalid');
      setLoading(false);
    } else {
      setLoading(false);
    }

    const interval = setInterval(() => {
      const id = searchParams.get('id') || localStorage.getItem('userId');
      if (id) {
        fetchUserData(id);
      }
      fetchAllUsers(); // Refresh all users data periodically
    }, 2000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, [searchParams, router]);

  return (
    <UserContext.Provider value={{ user, users, loading, setUser, setUsers, fetchAllUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);