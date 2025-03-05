"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faBriefcase, faTrophy, faPeopleArrows, faDollarSign, faCalendarAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Import from brands package
import Image from 'next/image';
import { useUser } from '../UserContext';

const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec";

export default function IdentificationPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [frontId, setFrontId] = useState<File | null>(null);
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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

  const handleSubmit = async () => {
    if (!resume || !frontId || !agreement) {
      alert("Please complete all fields and agree to the terms.");
      return;
    }

    setLoading(true);

    try {
      const resumeBase64 = await convertToBase64(resume);
      const frontIdBase64 = await convertToBase64(frontId);

      const payload = new URLSearchParams();
      payload.append("action", "uploadDocuments");
      payload.append("userId", user?.userId as string);
      payload.append("userFolderId", user?.userFolderId as string);
      payload.append("resume", resumeBase64);
      payload.append("frontId", frontIdBase64);

      console.log("Payload:", payload.toString());

      const response = await fetch(APP_SCRIPT_POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });
      const data = await response.json();
      console.log("Server Response:", data);

      if (data.success) {
        setTimeout(() => {
          //setLoading(false);
          router.push('/autonavigate');
        }, 10000); // Ensure loading state for 10 seconds
      } else {
        throw new Error(data.details || "Error uploading documents");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      alert("There was an error uploading your documents. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/invalid');
    }
  }, [user, router, userLoading]);

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="p-6 lg:p-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Notice Section */}
        <section className="bg-yellow-100 dark:bg-yellow-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Important Notice</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ATTN: {user?.fullName}, please ensure that the information you provide matches your application information to avoid termination of your application.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            It is crucial to upload original and matching documents for security reasons, as a background check will be conducted.
          </p>
        </section>

        {/* Document Upload Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Upload Your Documents</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setResume)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Front of ID (Image - Passport, Driver's License, etc.)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFrontId)} className="mt-1 block w-full" disabled={loading} />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={agreement} onChange={() => setAgreement(!agreement)} className="mr-2" disabled={loading} />
                I agree to the terms and conditions, including the privacy policy and consent to background checks.
              </label>
            </div>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </section>

        {/* Contact Information Block */}
        <div className="w-full max-w-7xl mx-auto mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Contact Us Directly
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you want to contact us directly or have any immediate questions, you can reach us using the following methods:
          </p>
          <div className="space-y-4">
            {/* WhatsApp Contact Section */}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="text-blue-600 h-6 w-6 mr-2" />
              <a href={`tel:${user?.helpCenterPhone}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                {user?.helpCenterPhone}
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 h-6 w-6 mr-2" />
              <a href={`mailto:${user?.helpCenterEmailAddress}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                {user?.helpCenterEmailCover}
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 h-6 w-6 mr-2" />
              <p className="text-gray-600 dark:text-gray-400">
                Available Monday to Friday, 8 AM - 7 PM (EST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}