import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Ticket, Admin } from './types'; // Import the User, Ticket, and Admin interfaces

// Define the URLs for both user, ticket, and admin data
const APP_SCRIPT_USER_URL = "https://script.google.com/macros/s/AKfycbxcoCDXcWlKPDbttlFf2eR_EeuMkfupy5dfgIOklM1ShEZ30gfD3wzZZOxkKV4xIWEl/exec?sheetname=user";
const APP_SCRIPT_TICKET_URL = "https://script.google.com/macros/s/AKfycbxcoCDXcWlKPDbttlFf2eR_EeuMkfupy5dfgIOklM1ShEZ30gfD3wzZZOxkKV4xIWEl/exec?sheetname=ticket";
const APP_SCRIPT_ADMIN_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec?sheetname=admin"; // Admin URL

interface UserContextProps {
  user: User | null;
  users: User[];
  ticket: Ticket | null;
  tickets: Ticket[];
  admin: Admin | null; // Admin state
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>; // Added setAdmin function
  fetchAllUsers: () => Promise<void>;
  fetchAllTickets: () => Promise<void>;
  fetchAdminData: (username: string, password: string) => Promise<void>; // Function to fetch admin data
}

const UserContext = createContext<UserContextProps>({
  user: null,
  users: [],
  ticket: null,
  tickets: [],
  admin: null, // Default to null
  loading: true,
  setUser: () => {},
  setUsers: () => {},
  setTicket: () => {},
  setTickets: () => {},
  setAdmin: () => {}, // Default function
  fetchAllUsers: async () => {},
  fetchAllTickets: async () => {},
  fetchAdminData: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [admin, setAdmin] = useState<Admin | null>(null); // Admin state
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Retry mechanism with exponential backoff
  const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        return await response.json();
      } catch (error) {
        attempt++;
        if (attempt < retries) {
          console.log(`Retrying... attempt ${attempt}`);
          await new Promise(resolve => setTimeout(resolve, delay * attempt)); // Exponential backoff
        } else {
          console.error("Failed to fetch after multiple attempts:", error);
          throw error;
        }
      }
    }
  };

  // Fetch admin data by username and password
  const fetchAdminData = async (username: string, password: string) => {
    try {
      const data: Admin[] = await fetchWithRetry(APP_SCRIPT_ADMIN_URL);
      const adminData = data.find((admin) => admin.username === username && admin.password === password);
      if (adminData) {
        setAdmin(adminData); // Set the admin data in context
        sessionStorage.setItem("loggedInAdmin", username); // Store in sessionStorage
      } else {
        alert("Invalid admin credentials!");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data by userId
  const fetchUserData = async (id: string) => {
    try {
      const data: User[] = await fetchWithRetry(APP_SCRIPT_USER_URL);
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

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const data: User[] = await fetchWithRetry(APP_SCRIPT_USER_URL);
      setUsers(data);
      localStorage.setItem('allUsersData', JSON.stringify(data)); // Cache all users data
    } catch (error) {
      console.error('Error fetching all users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ticket data by ticketId
  const fetchTicketData = async (ticketId: string) => {
    try {
      const data: Ticket[] = await fetchWithRetry(APP_SCRIPT_TICKET_URL);
      const ticketData = data.find((row: Ticket) => row.ticketId === ticketId);
      if (ticketData) {
        setTicket(ticketData);
        localStorage.setItem('ticketData', JSON.stringify(ticketData)); // Cache ticket data
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tickets
  const fetchAllTickets = async () => {
    try {
      const data: Ticket[] = await fetchWithRetry(APP_SCRIPT_TICKET_URL);
      setTickets(data);
      localStorage.setItem('allTicketsData', JSON.stringify(data)); // Cache all tickets data
    } catch (error) {
      console.error('Error fetching all tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sequential data fetching with a delay in between
  const fetchDataSequentially = async () => {
    try {
      setLoading(true);

      // Fetch data in sequence with a delay (e.g., 2 minutes between each fetch)
      await fetchUserData('user-id-here'); // Fetch user data first
      await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)); // Wait for 2 minutes

      await fetchAllUsers(); // Fetch all users
      await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)); // Wait for 2 minutes

      await fetchAllTickets(); // Fetch all tickets
      await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000)); // Wait for 2 minutes

      await fetchAdminData('admin-username', 'admin-password'); // Fetch admin data

      setLoading(false); // Done fetching
    } catch (error) {
      console.error("Error fetching data sequentially:", error);
    }
  };

  // useEffect hook to handle fetching based on URL parameters and cache
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    const cachedId = localStorage.getItem('userId');
    const cachedUserData = localStorage.getItem('userData');
    const cachedAllUsersData = localStorage.getItem('allUsersData');
    const cachedTicketData = localStorage.getItem('ticketData');
    const cachedAllTicketsData = localStorage.getItem('allTicketsData');
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

    if (cachedTicketData) {
      try {
        setTicket(JSON.parse(cachedTicketData));
      } catch (e) {
        console.error("Error parsing cached ticket data", e);
        localStorage.removeItem('ticketData');
      }
    }

    if (cachedAllTicketsData) {
      try {
        setTickets(JSON.parse(cachedAllTicketsData));
      } catch (e) {
        console.error("Error parsing cached all tickets data", e);
        localStorage.removeItem('allTicketsData');
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

    // Fetch ticket data based on the user's ticketId
    if (user && user.ticketId) {
      fetchTicketData(user.ticketId); // Fetch ticket based on user's ticketId
    }

    // Start fetching all data sequentially
    fetchDataSequentially();

    const interval = setInterval(() => {
      const id = searchParams.get('id') || localStorage.getItem('userId');
      if (id) {
        fetchUserData(id);
      }
      fetchAllUsers(); // Refresh all users data periodically
      fetchAllTickets(); // Refresh all tickets data periodically
    }, 300000);  // Set a larger interval (e.g., 5 minutes)

    return () => clearInterval(interval);
  }, [searchParams, router, user]); // Added 'user' dependency here

  return (
    <UserContext.Provider
      value={{
        user,
        users,
        ticket,
        tickets,
        admin, // Provide admin data in context
        loading,
        setUser,
        setUsers,
        setTicket,
        setTickets,
        setAdmin, // Provide setAdmin function
        fetchAllUsers,
        fetchAllTickets,
        fetchAdminData, // Provide fetchAdminData function
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
