import { useState } from 'react';
import { User, Ticket } from '../types';

// App Script URL for ticket approval
const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbxcoCDXcWlKPDbttlFf2eR_EeuMkfupy5dfgIOklM1ShEZ30gfD3wzZZOxkKV4xIWEl/exec";

interface AddUserModalProps {
  tickets: Ticket[];
  formData: { fullName: string; phoneNumber: string; emailAddress: string; seatNumbers: string };
  setFormData: React.Dispatch<React.SetStateAction<{ fullName: string; phoneNumber: string; emailAddress: string; seatNumbers: string }>>;
  onAddUser: () => void;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  tickets,
  formData,
  setFormData,
  onAddUser,
  onClose
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(''); // Initialize selectedTicketId here
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedTicketId) {
      setError('Please select a ticket.');
      return;
    }
  
    if (!formData.seatNumbers) {
      setError('Please specify seat numbers.');
      return;
    }
  
    setLoading(true);
  
    try {
      // POST request to save new user
      const payload = new URLSearchParams();
      payload.append("action", "transferTicket");
      payload.append("fullName", formData.fullName);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("emailAddress", formData.emailAddress);
      payload.append("seatNumbers", formData.seatNumbers);
      payload.append("ticketId", selectedTicketId);
  
      const response = await fetch(APP_SCRIPT_POST_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });
  
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
  
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        onAddUser(); // Refresh user table
        onClose(); // Close the modal
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'An unexpected error occurred.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="block text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {/* Ticket Selection Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm">Select Ticket</label>
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">--Select a Ticket--</option>
              {tickets.map(ticket => (
                <option key={ticket.ticketId} value={ticket.ticketId}>
                  {ticket.eventName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm">Seat Numbers</label>
            <input
              type="text"
              name="seatNumbers"
              value={formData.seatNumbers}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
