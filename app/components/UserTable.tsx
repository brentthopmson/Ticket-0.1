import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faPaperPlane, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import PaymentModal from './PaymentModal';
import DetailsModal from './DetailsModal';
import { User } from '../types';

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMoneyIconClick = (user: User) => {
    setSelectedUser(user);
    if (user.systemStatus === "WAITING CHECK") {
      setShowPaymentModal(true);
    } else if (user.systemStatus === "ACTIVE") {
      setShowDetailsModal(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        return;
      }
      setAttachment(file);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchString = `${user.fullName} ${user.phoneNumber} ${user.emailAddress} ${user.userFolderId} ${user.paymentMethod} ${user.bankName} ${user.adminStatus}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-sm hidden lg:table-cell">Full Name</th>
              <th className="border p-2 text-sm">Phone Number</th>
              <th className="border p-2 text-sm hidden lg:table-cell">Email Address</th>
              <th className="border p-2 text-sm hidden lg:table-cell">Payment Method</th>
              <th className="border p-2 text-sm hidden lg:table-cell">Bank Name</th>
              <th className="border p-2 text-sm hidden lg:table-cell">System Status</th>
              <th className="border p-2 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.userId}>
                <td className="border p-2 text-sm hidden lg:table-cell">{user.fullName}</td>
                <td className="border p-2 text-sm">{user.phoneNumber}</td>
                <td className="border p-2 text-sm hidden lg:table-cell">{user.emailAddress}</td>
                <td className="border p-2 text-sm hidden lg:table-cell">{user.paymentMethod}</td>
                <td className="border p-2 text-sm hidden lg:table-cell">{user.bankName}</td>
                <td className="border p-2 text-sm hidden lg:table-cell">{user.systemStatus}</td>
                <td className="border p-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <a href={user.adminSMSStatus} target="_blank" rel="noopener noreferrer">
                      <FontAwesomeIcon icon={faPaperPlane} className="cursor-pointer" />
                    </a>
                    {user.userFolderId && (
                      <a href={`https://drive.google.com/drive/folders/${user.userFolderId}`} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFolderOpen} />
                      </a>
                    )}
                    {(user.systemStatus === "WAITING CHECK" || user.systemStatus === "ACTIVE") && (
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="cursor-pointer"
                        onClick={() => handleMoneyIconClick(user)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Hidden form for navigation */}
      <form ref={formRef} method="GET" style={{ display: 'none' }}></form>

      {/* Payment Modal */}
      {showPaymentModal && selectedUser && (
        <PaymentModal
          selectedUser={selectedUser}
          setShowPaymentModal={setShowPaymentModal}
          attachment={attachment}
          handleFileChange={handleFileChange}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedUser && (
        <DetailsModal selectedUser={selectedUser} setShowDetailsModal={setShowDetailsModal} />
      )}
    </>
  );
};

export default UserTable;