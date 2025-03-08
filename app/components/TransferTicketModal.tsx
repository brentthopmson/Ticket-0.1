import { useState, useEffect } from 'react';
import { User, Ticket } from '../types';
import { useUser } from '../UserContext'; // Import the custom hook to access user context

interface TransferTicketModalProps {
  user: User;
  tickets: Ticket[];
  onClose: () => void;
}

const TransferTicketModal: React.FC<TransferTicketModalProps> = ({ user, tickets, onClose }) => {
  const { admin } = useUser(); // Access the admin context
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    seatNumbers: '' // Make sure seatNumbers is part of the formData
  });
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
      setError("Please select a ticket to transfer");
      return;
    }

    if (!formData.seatNumbers) {
      setError("Please specify seat numbers");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!admin) {
        throw new Error("Admin session expired");
      }

      const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId);
      if (!selectedTicket) {
        throw new Error("Selected ticket not found");
      }

      const payload = new URLSearchParams();
      // Use admin details from the context
      payload.append("action", "transferTicket");
      payload.append("timestamp", new Date().toISOString());
      payload.append("admin", sessionStorage.getItem("loggedInAdmin")!); // Assuming admin info is stored in sessionStorage
      payload.append("senderName", admin.senderName); // Use senderName from admin context
      payload.append("senderEmail", admin.senderEmail); // Use senderEmail from admin context
      payload.append("fullName", formData.fullName);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("emailAddress", formData.emailAddress);
      payload.append("ticketId", selectedTicketId);
      payload.append("seatNumbers", formData.seatNumbers);

      const response = await fetch("https://script.google.com/macros/s/AKfycbxcoCDXcWlKPDbttlFf2eR_EeuMkfupy5dfgIOklM1ShEZ30gfD3wzZZOxkKV4xIWEl/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });

      if (response.ok) {
        alert("Ticket transfer initiated successfully!");
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to transfer ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error transferring ticket:", error);
      setError("An error occurred while transferring the ticket.");
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets that belong to this admin
  const adminTickets = tickets.filter(ticket => ticket.admin === sessionStorage.getItem("loggedInAdmin"));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Transfer Ticket</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Ticket*</label>
            <select
              value={selectedTicketId}
              onChange={(e) => setSelectedTicketId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            >
              <option value="">-- Select a ticket --</option>
              {adminTickets.map(ticket => (
                <option key={ticket.ticketId} value={ticket.ticketId}>
                  {ticket.eventName} - {ticket.venue} - Section {ticket.section} {ticket.sectionNo}, Row {ticket.row}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipient Full Name*</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter recipient's full name"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipient Phone Number*</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter recipient's phone number"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipient Email*</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter recipient's email"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Seat Numbers*</label>
            <input
              type="text"
              name="seatNumbers"
              value={formData.seatNumbers}
              onChange={handleChange}
              placeholder="Enter seat numbers"
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Transfer Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferTicketModal;
