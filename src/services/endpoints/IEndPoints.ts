export interface IEndPoints {
  login: string;
  logout: string;
  passwordReset: string;
  forgotPassword: string;
  forgotPasswordReset: string;

}

export interface IUserEndPoints extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string;
  getUserData: string;
  changeProfileInfo: string;
  isUserActive: string;
  getOrganizerShortInfo: string;

  getAllEvents: string;
  getOnlineEventData: string;
  getOfflineEventData: string;

  getOrganizerProfileData: string;

  bookingFromSubmit: string;
}

export interface IOrganizerEndPoints extends IEndPoints {
  register: string;
  emailVerification: string;
  emailVerificationTokenVerify: string;
  getOrganizerProfile: string;
  updateOrganizerProfile: string;
  organizerSettings: string;
  getOrganizersForCollaboration: string;
  getAccountConnectingLink: string;

  //Event management endPoints
  eventCategoryReqeust: string;
  getAllActiveEventCategories: string;

  ///
  getEventsByOrganizer: string;
  getSpecificEventById: string;
  requestAdminApprovalForEvent: string;

  // Online Event creation and edit
  createOnlineEventDetail: string;
  getOnlineEventDetail: string;

  createOnlineEventTimeSlots: string;
  getOnlineEventTimeSlot: string;

  createOnlineEventTicket: string;
  getOnlineEventTicket: string;

  createOnlineEventSetting: string;
  getEventSetting: string;

  // Offline Event creation and edit
  createOfflineEventDetail: string;
  getOfflineEventDetail: string;

  createOfflineEventTicket: string;
  getOfflineEventTicket: string;

  ///
  deleteEvent: string;
  withdrawEventApprovalRequest: string;

  getBookedUsersList: string;
}

export interface IAdminEndPoints {
  getAllUsers: string;
  blockOrUnblockUser: string;
  getAllOrganizers: string;
  getOrganizerDetails: string;
  changeOrganizerStatus: string;
  changeAdminPassword: string;

  // Event management endpoints
  getAllEventCategories: string;
  changeEventCategoryStatus: string;
  getAllEventApprovalRequest: string;
  getEventDetails: string;
  getAllApprovedEvents: string;
  changeEventStatus: string;
  eventBlockAndUnBlock: string;
  eventAcceptAndReject: string;
}


export interface ICommonEndPoints {
  booking: string;
}