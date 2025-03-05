import { useState } from 'react';
import { User } from '../types';

const APP_SCRIPT_PAYMENT_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec";

interface PaymentModalProps {
  selectedUser: User;
  setShowPaymentModal: (show: boolean) => void;
  attachment: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ selectedUser, setShowPaymentModal, attachment, handleFileChange }) => {
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Remove the data URL prefix
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const payload = new URLSearchParams();
    formData.forEach((value, key) => {
      payload.append(key, value.toString());
    });
    payload.append("action", "sendPayment");
    payload.append("userId", selectedUser?.userId as string);
    payload.append("userFolderId", selectedUser?.userFolderId as string);

    if (attachment) {
      try {
        const attachmentBase64 = await convertToBase64(attachment);
        payload.append("attachment", attachmentBase64);
        payload.append("attachmentName", attachment.name); // Send the filename
      } catch (error) {
        console.error("Error converting attachment to base64:", error);
        alert("Failed to upload attachment. Please try again.");
        return;
      }
    }

    console.log("Payload:", payload.toString());

    try {
      const response = await fetch(APP_SCRIPT_PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });
      const data = await response.json();
      console.log("Response:", data); // Log the response from the server
      if (data.success) {
        alert("Payment submitted successfully!");
        setShowPaymentModal(false);
      } else {
        alert("Error submitting payment: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("There was an error submitting the payment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Submit Payment</h2>
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Payment Type</label>
            <select name="paymentType" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required>
              <option value="Mobile Deposit">Mobile Deposit</option>
              <option value="Mailing">Mailing</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Total Amount</label>
            <input type="number" name="totalAmount" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Client Amount</label>
            <input type="number" name="clientAmount" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Cashout</label>
            <input type="number" name="cashout" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Payment Instruction</label>
            <textarea name="paymentInstruction" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" required></textarea>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Attachment</label>
            <input type="file" name="attachment" className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100" onChange={handleFileChange} />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition">Send Payment</button>
        </form>
        <button onClick={() => setShowPaymentModal(false)} className="mt-4 w-full bg-red-600 text-white px-6 py-3 rounded-full text-lg hover:bg-red-500 transition">Cancel</button>
      </div>
    </div>
  );
};

export default PaymentModal;