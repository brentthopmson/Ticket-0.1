import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importing useRouter from next/navigation
import { useUser } from '../UserContext'; // Import the useUser hook from context

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setAdmin, fetchAllUsers, fetchAdminData, loading } = useUser(); // Extracting necessary methods from context
  const router = useRouter(); // Accessing the router object

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!username || !password) {
      console.error("Please enter both username and password.");
      return;
    }

    try {
      await fetchAdminData(username, password); // Call the fetchAdminData method for login
      fetchAllUsers(); // Fetch users once admin logs in
      router.push('/admin'); // Redirect the user to the admin page after successful login
    } catch (error) {
      console.error('Error logging in:', error); // Handle login errors
    }
  };

  return (
    <div className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
