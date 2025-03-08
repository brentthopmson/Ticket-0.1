// /components/UserTable.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faPaperPlane, faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import TransferTicketModal from './TransferTicketModal';
import { User, Ticket } from '../types';

interface UserTableProps {
  users: User[];
  tickets: Ticket[];
}

const UserTable: React.FC<UserTableProps> = ({ users, tickets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTransferTicket = (user: User) => {
    setSelectedUser(user);
    setShowTransferModal(true);
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.fullName} ${user.phoneNumber} ${user.emailAddress} ${user.userFolderId} ${user.paymentMethod} ${user.bankName} ${user.adminStatus}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Users Management</h2>
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-sm text-left">Full Name</th>
                <th className="border p-2 text-sm text-left">Phone Number</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Email Address</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Payment Method</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Bank Name</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">System Status</th>
                <th className="border p-2 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2 text-sm">{user.fullName}</td>
                  <td className="border p-2 text-sm">{user.phoneNumber}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{user.emailAddress}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{user.paymentMethod}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{user.bankName}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.systemStatus === "ACTIVE" 
                        ? "bg-green-100 text-green-800" 
                        : user.systemStatus === "WAITING CHECK" 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.systemStatus}
                    </span>
                  </td>
                  <td className="border p-2 text-sm">
                    <div className="flex items-center justify-center space-x-3">
                      <a 
                        href={user.adminSMSStatus} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Send SMS"
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </a>
                      {user.userFolderId && (
                        <a 
                          href={`https://drive.google.com/drive/folders/${user.userFolderId}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Open Folder"
                        >
                          <FontAwesomeIcon icon={faFolderOpen} />
                        </a>
                      )}
                      <button
                        className="text-purple-600 hover:text-purple-800"
                        title="Transfer Ticket"
                        onClick={() => handleTransferTicket(user)}
                      >
                        <FontAwesomeIcon icon={faTicketAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No users found matching your search criteria.
          </div>
        )}
      </section>

      {/* Transfer Ticket Modal */}
      {showTransferModal && selectedUser && (
        <TransferTicketModal 
          user={selectedUser} 
          tickets={tickets}
          onClose={() => setShowTransferModal(false)} 
        />
      )}
    </>
  );
};

export default UserTable;
