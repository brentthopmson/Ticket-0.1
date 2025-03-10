import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faPaperPlane, faTicketAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import AddUserModal from './AddUserModal'; // Add new modal component for adding users
import { User, Ticket } from '../types';

interface UserTableProps {
  users: User[];
  tickets: Ticket[];
}

const UserTable: React.FC<UserTableProps> = ({ users, tickets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    seatNumbers: '', // You can add seat numbers if necessary
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // This handles adding a user (without submitting in the table, modal will take care of submission)
  const handleAddUser = () => {
    setShowAddUserModal(true); // Show the modal for adding a user
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.fullName} ${user.phoneNumber} ${user.emailAddress} ${user.ticketFolderId} ${user.eventName} ${user.section} ${user.adminStatus}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Users</h2>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center w-full sm:w-auto justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="border p-2 text-sm text-left">Full Name</th>
                <th className="border p-2 text-sm text-left">Phone Number</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Email Address</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Event</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Section</th>
                <th className="border p-2 text-sm text-left hidden lg:table-cell">Status</th>
                <th className="border p-2 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2 text-sm">{user.fullName}</td>
                  <td className="border p-2 text-sm">{user.phoneNumber}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{user.emailAddress}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{user.eventName}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">{user.section}</td>
                  <td className="border p-2 text-sm hidden lg:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.systemStatus === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : user.systemStatus === 'WAITING CHECK'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
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
                      {user.ticketFolderId && (
                        <a
                          href={`https://drive.google.com/drive/folders/${user.ticketFolderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Open Folder"
                        >
                          <FontAwesomeIcon icon={faFolderOpen} />
                        </a>
                      )}
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          tickets={tickets}
          formData={newUserFormData}
          setFormData={setNewUserFormData}
          onAddUser={handleAddUser}
          onClose={() => setShowAddUserModal(false)}
        />
      )}
    </>
  );
};

export default UserTable;
