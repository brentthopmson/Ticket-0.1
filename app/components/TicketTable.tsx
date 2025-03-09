// /components/TicketTable.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { User, Ticket } from '../types';
import AddTicketModal from './AddTicketModal';
import UpdateTicketModal from './UpdateTicketModal';

interface TicketTableProps {
  tickets: Ticket[];
  users: User[];
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleUpdateTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowUpdateModal(true);
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    
    try {
      const currentDate = new Date().toISOString();
      const payload = new URLSearchParams();
      payload.append("action", "deleteTicket");
      payload.append("ticketId", ticketId);
      payload.append("deletedSTAMP", currentDate);
      
      const response = await fetch("https://script.google.com/macros/s/AKfycbxcoCDXcWlKPDbttlFf2eR_EeuMkfupy5dfgIOklM1ShEZ30gfD3wzZZOxkKV4xIWEl/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });
      
      if (response.ok) {
        alert("Ticket deleted successfully!");
        // You might want to refresh the tickets list here
      } else {
        alert("Failed to delete ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("An error occurred while deleting the ticket.");
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchString = `${ticket.eventName} ${ticket.venue} ${ticket.section} ${ticket.row}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tickets Management</h2>
          <div className="flex items-center space-x-4">
            <div className="w-64">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Ticket
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-sm text-left">Event Name</th>
                <th className="border p-2 text-sm text-left">Venue</th>
                <th className="border p-2 text-sm text-left hidden md:table-cell">Date & Time</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Section</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Row</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Seats</th>
                <th className="border p-2 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.ticketId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2 text-sm">{ticket.eventName}</td>
                  <td className="border p-2 text-sm">{ticket.venue}</td>
                  <td className="border p-2 text-sm hidden md:table-cell">
                    {new Date(ticket.dateTime).toLocaleString()}
                  </td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{ticket.section} {ticket.sectionNo}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{ticket.row}</td>
                  <td className="border p-2 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleUpdateTicket(ticket)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Update Ticket"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.ticketId)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Ticket"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No tickets found matching your search criteria.
          </div>
        )}
      </section>

      {/* Add Ticket Modal */}
      {showAddModal && (
        <AddTicketModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Update Ticket Modal */}
      {showUpdateModal && selectedTicket && (
        <UpdateTicketModal 
          ticket={selectedTicket} 
          onClose={() => setShowUpdateModal(false)} 
        />
      )}
    </>
  );
};

export default TicketTable;
