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
  fetchAdminData: (username: string, password: string) => Promise<boolean>; // ✅ FIXED
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
  fetchAdminData: async () => false, // ✅ FIXED
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
  const fetchAdminData = async (username: string, password: string): Promise<boolean> => {
    try {
      const data: Admin[] = await fetchWithRetry(APP_SCRIPT_ADMIN_URL);
      const adminData = data.find((admin) => admin.username === username && admin.password === password);
      if (adminData) {
        setAdmin(adminData);
        sessionStorage.setItem("loggedInAdmin", username);
        sessionStorage.setItem("adminData", JSON.stringify(adminData));
        return true; // ✅ Login success
      } else {
        alert("Invalid admin credentials!");
        sessionStorage.removeItem("loggedInAdmin"); // ✅ Clear any incorrect data
        sessionStorage.removeItem("adminData");
        setAdmin(null); // ✅ Clear admin state if login fails
        return false; // ❌ Login failed
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  



    // Fetch user data by userId
    const fetchUserData = async (id: string) => {
      const cachedUserData = localStorage.getItem('userData');
      if (cachedUserData) {
          try {
              const userData = JSON.parse(cachedUserData);
              setUser(userData);
              setLoading(false);
              return;
          } catch (e) {
              console.error('Error parsing cached user data', e);
              localStorage.removeItem('userData');
          }
      }

      try {
          const data: User[] = await fetchWithRetry(APP_SCRIPT_USER_URL);
          const userData = data.find((row: User) => row.userId === id);
          if (userData) {
              setUser(userData);
              localStorage.setItem('userData', JSON.stringify(userData));
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
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); // Wait for 2 minutes

      await fetchAllTickets(); // Fetch all tickets
      await new Promise(resolve => setTimeout(resolve, 10 * 60 * 1000)); // Wait for 2 minutes

      await fetchAdminData('admin-username', 'admin-password'); // Fetch admin data

      setLoading(false); // Done fetching
    } catch (error) {
      console.error("Error fetching data sequentially:", error);
    }
  };

  // useEffect hook to handle fetching based on URL parameters and cache
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    const cachedUserData = localStorage.getItem('userData');
    const cachedAllUsersData = localStorage.getItem('allUsersData');
    const cachedTicketData = localStorage.getItem('ticketData');
    const cachedAllTicketsData = localStorage.getItem('allTicketsData');
    const currentPath = window.location.pathname;

    // First, update localStorage with the new idFromUrl if it exists
    if (idFromUrl) {
        localStorage.setItem('userId', idFromUrl);
    }

    // Now, retrieve the cachedId from localStorage, which might have been updated
    const cachedId = localStorage.getItem('userId');

    // Handle cached data
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

    // Fetch user data based on idFromUrl or cachedId, if not already cached
    if (idFromUrl && !cachedUserData) {
        fetchUserData(idFromUrl);
    } else if (cachedId && !cachedUserData) {
        fetchUserData(cachedId);
    } else if (!currentPath.startsWith('/admin') && !cachedUserData) {
        router.push('/invalid');
        setLoading(false);
    } else {
        setLoading(false);
    }

    // Fetch ticket data based on the user's ticketId
    if (user && user.ticketId) {
        fetchTicketData(user.ticketId);
    }

    // Start fetching all data sequentially
    fetchDataSequentially();

    const interval = setInterval(() => {
        fetchAllUsers();
        fetchAllTickets();
    }, 300000);

    return () => clearInterval(interval);
}, [searchParams, router, user]);

  // Add this to your useEffect in UserContext.tsx
  useEffect(() => {
    // Check for stored admin data
    const loggedInAdminUsername = sessionStorage.getItem("loggedInAdmin");
    const storedAdminData = sessionStorage.getItem("adminData");
    
    if (storedAdminData) {
      try {
        setAdmin(JSON.parse(storedAdminData));
      } catch (e) {
        console.error("Error parsing stored admin data", e);
        sessionStorage.removeItem("adminData");
      }
    } else if (loggedInAdminUsername) {
      // If we only have the username but not the full data, try to fetch it
      fetchAdminData(loggedInAdminUsername, ""); // Password will be ignored in this case
    }
  }, []);


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
