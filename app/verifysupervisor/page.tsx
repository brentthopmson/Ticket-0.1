"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../UserContext';

const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbwXIfuadHykMFrMdPPLLP7y0pm4oZ8TJUnM9SMmDp9BkaVLGu9jupU-CuW8Id-Mm1ylxg/exec";

export default function VerifySupervisorPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/invalid');
    }
  }, [user, router, userLoading]);

  const handleVerification = async () => {
    if (!user) {
      setError("User data not available.");
      return;
    }

    if (!verificationCode) {
      setError("Please enter the verification code.");
      return;
    }

    if (user.verificationCode !== verificationCode) {
      setError("Invalid verification code. Please contact your supervisor.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = new URLSearchParams();
      payload.append("action", "setContacted");
      payload.append("userId", user.userId as string);
      payload.append("contacted", "TRUE");

      const response = await fetch(APP_SCRIPT_POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString()
      });

      const data = await response.json();

      if (data.success) {
        setTimeout(() => {
          router.push('/autonavigate');
        }, 10000);
      } else {
        setError(data.details || "Failed to update verification status. Please try again.");
      }
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex items-center justify-center p-6 lg:p-12 bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Verify Supervisor</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Please contact your appointed supervisor to validate confidential communication. Your supervisor will provide you with a verification code during your call session. This verification is required before your workspace setup payment can be processed.
          </p>
          {user.supervisorName && user.supervisorPhoneNumber && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Contact your supervisor: <br />
              {user.supervisorName} - <a href={`tel:${user.supervisorPhoneNumber}`}>{user.supervisorPhoneNumber}</a>
            </p>
          )}
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            disabled={loading}
          />
        </div>

        <div>
          <button
            onClick={handleVerification}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </main>
  );
}