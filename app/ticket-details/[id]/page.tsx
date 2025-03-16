'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faInfoCircle, faTicketAlt, faUser, faCalendarAlt, faChair, faIdCard, faCheckCircle, faBell, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useUser } from '../../UserContext';

const APP_SCRIPT_POST_URL = "https://script.google.com/macros/s/AKfycbxcoCDXcWlKPDbttlFf2eR_EeuMkfupy5dfgIOklM1ShEZ30gfD3wzZZOxkKV4xIWEl/exec";

export default function TicketDetails() {
    const router = useRouter();
    const { fetchUserData } = useUser();
    const [approvalStatus, setApprovalStatus] = useState('pending');
    const [pageReady, setPageReady] = useState(false);
    const initialStatusSet = useRef(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const params = useParams();
    const userId = params.id as string;
    console.log(userId);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (userId) {
            const fetchAndSetUser = async () => {
                setLoading(true); // Set loading to true
                try {
                    const fetchedUser = await fetchUserData(userId);
                    console.log("Fetched user:", fetchedUser);

                    if (fetchedUser) {
                        setUser(fetchedUser);
                    } else {
                        console.error("User not found for userId:", userId);
                        router.push('/invalid');
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                    router.push('/invalid');
                } finally {
                    setLoading(false); // Set loading to false
                }
            };
            fetchAndSetUser();
        } else {
            console.error("userId is undefined");
            router.push('/invalid');
            setLoading(false);
        }
    }, [userId, fetchUserData, router]);

    useEffect(() => {
      if (user && userId && !loading) {
          console.log("user.systemStatus:", user.systemStatus);
          console.log("Redirect condition:", user.systemStatus === "DECLINED" || user.systemStatus === "RETRACTED" || user.systemStatus === "CANCELLED");
  
          if (
              user.systemStatus === "DECLINED" ||
              user.systemStatus === "RETRACTED" ||
              user.systemStatus === "CANCELLED"
          ) {
              router.push("/invalid");
              return;
          }
  
          if (user.systemStatus === "WAITING APPROVAL") {
              setApprovalStatus("pending");
          } else if (
              user.systemStatus === "WAITING COMPLETION" ||
              user.systemStatus === "COMPLETED"
          ) {
              setApprovalStatus("approved");
          }
  
          setPageReady(true);
          initialStatusSet.current = true;
      }
  }, [user, router, userId, loading]);
  
    const handleAcceptTicket = useCallback(() => {
        if (user?.approvalSTAMP) return;

        setIsActionLoading(true);
        setApprovalStatus('processing');

        const currentDate = new Date().toISOString();
        let payload = new URLSearchParams();
        payload.append("action", "ticketApproval");
        payload.append("userId", user?.userId as string);
        payload.append("approvalSTAMP", currentDate);

        fetch(APP_SCRIPT_POST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: payload.toString()
        }).then(() => {
            setTimeout(() => {
                setApprovalStatus('approved');
                setIsActionLoading(false);
            }, 10000);
        }).catch(error => {
            console.error("Error accepting ticket:", error);
            setApprovalStatus('pending');
            setIsActionLoading(false);
        });
    }, [user]);

    const handleDeclineTransfer = useCallback(() => {
        if (user?.approvalSTAMP) return;

        setIsActionLoading(true);
        setApprovalStatus('processing');

        let payload = new URLSearchParams();
        payload.append("action", "ticketApproval");
        payload.append("userId", user?.userId as string);
        payload.append("approvalSTAMP", "DECLINED");

        fetch(APP_SCRIPT_POST_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: payload.toString()
        }).then(() => {
            setTimeout(() => {
                setApprovalStatus('declined');
                setIsActionLoading(false);
            }, 10000);
        }).catch(error => {
            console.error("Error declining ticket:", error);
            setApprovalStatus('pending');
            setIsActionLoading(false);
        });
    }, [user]);

    if (!pageReady) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#026CDF]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
                    <p className="text-gray-600">Please sign in to view ticket details.</p>
                </div>
            </div>
        );
    }

    const isTicketProcessed = approvalStatus === 'approved' || approvalStatus === 'declined';

    return (
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src={user.coverImage || "https://placehold.co/1200x600/026CDF/FFFFFF?text=Event+Image"}
          alt={user.eventName}
          fill
          style={{ objectFit: 'cover' }}
          priority
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white dark:text-white">
          <div className="inline-block bg-[#F5A623] text-[#001B41] px-3 py-1 rounded-full text-sm font-bold mb-3">
            Ticket Transfer
          </div>
          <h1 className="text-4xl font-bold mb-2 dark:text-white">{user.eventName}</h1>
          <div className="flex items-center space-x-2 text-lg">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>{user.venue}, {user.location}</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>{new Date(user.dateTime).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            {/* Ticket Approval Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Ticket Transfer Details</h2>

              {/* Notification Board or Approval Board based on status */}
              {isTicketProcessed ? (
                <div className={`mb-6 p-4 ${
                  approvalStatus === 'approved' 
                    ? 'bg-green-50 border border-green-200 dark:bg-green-700 dark:border-green-500' 
                    : 'bg-red-50 border border-red-200 dark:bg-red-700 dark:border-red-500'
                } rounded-lg`}>
                  <div className="flex items-start">
                    <div className={`rounded-full p-3 mr-4 ${
                      approvalStatus === 'approved' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      <FontAwesomeIcon 
                        icon={approvalStatus === 'approved' ? faCheckCircle : faTimesCircle} 
                        className="text-xl" 
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg dark:text-white">
                        {approvalStatus === 'approved' ? 'Ticket Accepted' : 'Ticket Declined'}
                      </h3>
                      <p className={`${
                        approvalStatus === 'approved' ? 'text-green-700' : 'text-red-700'
                      } dark:text-gray-200`}>
                        {user.messageStatus || (
                          approvalStatus === 'approved' 
                            ? 'You have successfully accepted this ticket. It is now available in your account.' 
                            : 'You have declined this ticket transfer. The ticket has been returned to the sender.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 dark:bg-blue-700 dark:border-blue-500 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#026CDF] rounded-full p-3 mr-4">
                      <FontAwesomeIcon icon={faTicketAlt} className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg dark:text-white">Ticket Transfer</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {approvalStatus === 'processing'
                          ? 'Processing your request...'
                          : 'This ticket has been transferred to you. Accept to add it to your account.'}
                      </p>
                    </div>
                  </div>
                  
                  {approvalStatus === 'pending' && (
                    <div className="flex space-x-4">
                      <button 
                          onClick={handleAcceptTicket}
                          className="flex-1 bg-[#026CDF] text-white py-3 rounded-lg font-semibold hover:bg-[#0256b3] transition-colors"
                          disabled={isActionLoading} // Disable button when loading
                      >
                          {isActionLoading ? 'Processing...' : 'Accept Transfer'}
                      </button>
                      <button 
                          onClick={handleDeclineTransfer}
                          className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                          disabled={isActionLoading} // Disable button when loading
                      >
                          Decline
                      </button>
                    </div>
                  )}
                  
                  {approvalStatus === 'processing' && (
                    <div className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#026CDF] mr-3"></div>
                      <p>Processing your request...</p>
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">From:</h3>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full p-2 mr-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{user.senderName || "John Doe"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.senderEmail || "john.doe@example.com"}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">To:</h3>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full p-2 mr-3">
                      <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{user.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.emailAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">Event Information:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faClock} className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium dark:text-white">Door Time</p>
                          <p className="text-gray-600 dark:text-gray-400">{user.doorTime}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faIdCard} className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium dark:text-white">Age Restriction</p>
                          <p className="text-gray-600 dark:text-gray-400">{user.ageRestriction || "All Ages"}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium dark:text-white">Event Status</p>
                          <p className="text-gray-600 dark:text-gray-400">{user.eventStatus || "Confirmed"}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">Ticket Information:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faChair} className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium dark:text-white">Section</p>
                          <p className="text-gray-600 dark:text-gray-400">{user.section} {user.sectionNo}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faChair} className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium dark:text-white">Row</p>
                          <p className="text-gray-600 dark:text-gray-400">{user.row}</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <FontAwesomeIcon icon={faChair} className="text-gray-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium dark:text-white">Seat(s)</p>
                          <p className="text-gray-600 dark:text-gray-400">{user.seatNumbers}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {user.description && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">Event Description:</h3>
                    <p className="text-gray-600 dark:text-gray-400">{user.description}</p>
                  </div>
                )}
                
                {user.terms && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2 dark:text-white">Terms & Conditions:</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-400">{user.terms}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-24">
              <div className="bg-[#026CDF] text-white p-4">
                <h2 className="text-xl font-bold">Ticket Preview</h2>
              </div>

              <div className="p-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  {/* Ticket Header */}
                  <div className="bg-[#001B41] text-white p-4">
                    <div className="text-lg font-bold">ticketmaster</div>
                  </div>

                  {/* Event Info */}
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-lg mb-1">{user.eventName}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {new Date(user.dateTime).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-600 text-sm">{user.venue}, {user.location}</p>
                  </div>

                  {/* Seat Info */}
                  <div className="p-4 grid grid-cols-2 gap-2 text-center">
                    <div className="border-r border-gray-200">
                      <p className="text-xs text-gray-500">SECTION</p>
                      <p className="font-bold">{user.section} {user.sectionNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROW</p>
                      <p className="font-bold">{user.row}</p>
                    </div>
                    <div className="border-r border-gray-200 border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-500">SEAT</p>
                      <p className="font-bold">{user.seatNumbers}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-500">TICKET STATUS</p>
                      <p className={`font-bold ${approvalStatus === 'declined' ? 'text-red-600' : ''}`}>
                        {approvalStatus === 'approved' ? 'Valid' :
                        approvalStatus === 'declined' ? 'Declined' :
                        'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Barcode Placeholder */}
                  <div className="p-4 border-t border-gray-200">
                    {approvalStatus === 'approved' ? (
                      <>
                        <div className="bg-white border border-gray-200 h-24 flex items-center justify-center">
                          {/* In a real app, you would display an actual barcode here */}
                          <div className="text-center">
                            <div className="text-sm font-bold mb-1">TICKET APPROVED</div>
                            <div className="text-xs">Barcode: {user.userId?.substring(0, 8).toUpperCase()}</div>
                          </div>
                        </div>
                        <p className="text-xs text-center mt-2 text-gray-500">
                          Scan this barcode at the venue for entry
                        </p>
                      </>
                    ) : approvalStatus === 'declined' ? (
                      <div className="bg-red-50 h-24 flex items-center justify-center border border-red-200">
                        <div className="text-center text-red-600">
                          <FontAwesomeIcon icon={faTimesCircle} className="text-3xl mb-2" />
                          <p className="text-sm">Ticket has been declined</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-200 h-24 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Barcode will appear here after transfer is accepted</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
                    <p>
                      This ticket is protected by Ticketmaster's SafeTix™ technology.
                      The barcode will refresh periodically to prevent screenshots or unauthorized transfers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
    );
}
