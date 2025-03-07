export interface User {
  userId: string;
  admin: string;
  organization: string;
  orgAddress: string;
  orgState: string;
  logo: string;
  position: string;
  roleList: string;
  roleDescription: string;
  helpCenterPhone: string;
  helpCenterEmailCover: string;
  helpCenterEmailAddress: string;
  supervisorName: string;
  supervisorPhoneNumber: string;

  fullName: string;
  phoneNumber: string;
  textMessage: string;
  interviewLink: string;
  emailAddress: string;
  timeIn: string;
  interviewResponse: string;
  timeOut: string;
  userFolderId: string;
  frontId: string;
  backId: string;
  selfie: string;
  resume: string;
  adminApprovalTime: string;
  signedLetter: string;
  paymentMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  address: string;
  payCount: string;
  totalAmount: string;
  totalPayout: string;
  route: string;
  titleStatus: string;
  messageStatus: string;
  warningStatus: string;
  systemStatus: string;
  percentageStatus: string;
  adminStatus: string;
  adminSMSStatus: string;
  adminApprovalTimeX7: string;
  verificationCode: string;

  
  username: string; // Add username field
}





// Define the Ticket interface
export interface Ticket {
  ticketId: string;
  ticketTitle: string;
  status: string;
  // Add other relevant ticket properties here
}