import { User } from '../types';

interface DetailsModalProps {
  selectedUser: User;
  setShowDetailsModal: (show: boolean) => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ selectedUser, setShowDetailsModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">User Details</h2>
        <div className="space-y-4">
          <p><strong>Position:</strong> {selectedUser.position}</p>
          <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
          <p><strong>Phone Number:</strong> {selectedUser.phoneNumber}</p>
          <p><strong>Email Address:</strong> {selectedUser.emailAddress}</p>
          <p><strong>User Folder ID:</strong> {selectedUser.userFolderId}</p>
          <p><strong>Payment Method:</strong> {selectedUser.paymentMethod}</p>
          <p><strong>Bank Name:</strong> {selectedUser.bankName}</p>
          <p><strong>Account Name:</strong> {selectedUser.accountName}</p>
          <p><strong>Account Number:</strong> {selectedUser.accountNumber}</p>
          <p><strong>Routing Number:</strong> {selectedUser.routingNumber}</p>
          <p><strong>Address:</strong> {selectedUser.address}</p>
          <p><strong>Pay Count:</strong> {selectedUser.payCount}</p>
          <p><strong>Total Amount:</strong> {selectedUser.totalAmount}</p>
          <p><strong>Total Payout:</strong> {selectedUser.totalPayout}</p>
          <p><strong>System Status:</strong> {selectedUser.systemStatus}</p>
          <p><strong>Percentage Status:</strong> {selectedUser.percentageStatus}</p>
        </div>
        <button onClick={() => setShowDetailsModal(false)} className="mt-4 w-full bg-red-600 text-white px-6 py-3 rounded-full text-lg hover:bg-red-500 transition">Close</button>
      </div>
    </div>
  );
};

export default DetailsModal;