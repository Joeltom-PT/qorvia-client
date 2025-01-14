import {
  IAdminEndPoints,
  IOrganizerEndPoints,
  IUserEndPoints,
  ICommonEndPoints
} from "./IEndPoints";

export const userEndPoints: IUserEndPoints = {
  signup: "/account/auth/register",
  verifyOTP: "/account/auth/verifyEmail",
  resendOTP: "/notification/resendOtp",
  login: "/account/auth/login",
  logout: "/account/auth/logout",
  forgotPassword: "/account/auth/forgotPasswordRequest",
  forgotPasswordReset: "/account/auth/forgotPasswordReset",

  passwordReset: "/account/user/passwordReset",
  getUserData: "/account/user/getUserData",
  changeProfileInfo: "/account/user/changeProfileInfo",
  isUserActive: "/account/user/isUserActive",
  getAllEvents: "/event/getAllEvents",
  getOrganizerShortInfo: "/account/public/getOrganizerShortInfo",

  getOnlineEventData: "/event/getOnlineEventData",
  getOfflineEventData: "/event/getOfflineEventData",

  getOrganizerProfileData: "/account/public/getOrganizerProfile",

  bookingFromSubmit: "/event/bookings",
  getAllRegisteredEvents: "/event/getAllRegisteredEvents",

  checkRoomAccess: "/communication/validate",
  getStreamKey: "/get-streaming-key/user",
};

export const organizerEndPoints: IOrganizerEndPoints = {
  register: "/account/auth/organizerRegister",
  emailVerification: "/account/auth/organizerEmailVerify",
  emailVerificationTokenVerify: "/account/auth/organizerVerificationToken",
  login: "/account/auth/organizerLogin",
  logout: "/account/auth/logout",
  // Not completed ..........
  passwordReset: "/account/auth/passwordReset",
  forgotPassword: "/account/auth/forgotPasswordRequest",
  forgotPasswordReset: "",
  getOrganizerProfile: "/account/organizer/getProfile",
  updateOrganizerProfile: "/account/organizer/updateProfile",
  organizerSettings: "/account/organizer/settings",
  getOrganizersForCollaboration: "/account/organizer/get-organizers-for-collaboration",

  getAccountConnectingLink: "/account/organizer/connect-account-for-payout",
  //.........................

  //Event management endPoints
  eventCategoryReqeust: "/event/categoryRequest",
  getAllActiveEventCategories: "/event/getAllActiveEventCategories",

  //Event Management Page
  getEventsByOrganizer: "/event/getEventsByOrganizer",
  getSpecificEventById: "/event/getSpecificEventById",
  requestAdminApprovalForEvent: "/event/request-admin-approval",

  // Online Event creation and edit
  createOnlineEventDetail: "/event/createOnlineEvent/detail",
  getOnlineEventDetail: "/event/getOnlineEvent/detail",

  createOnlineEventTimeSlots: "/event/createOnlineEvent/timeSlot",
  getOnlineEventTimeSlot: "/event/getOnlineEvent/timeSlot",

  createOnlineEventTicket: "/event/createOnlineEvent/ticket",
  getOnlineEventTicket: "/event/getOnlineEvent/ticket",

  createOnlineEventSetting: "/event/createOnlineEvent/setting",
  getEventSetting: "/event/getEvent/setting",

  // Offline Event creation and edit
  createOfflineEventDetail: "/event/createOfflineEvent/detail",
  getOfflineEventDetail: "/event/getOfflineEvent/detail",

  createOfflineEventTicket: "/event/createOfflineEvent/ticket",
  getOfflineEventTicket: "/event/getOfflineEvent/ticket",

  //
  deleteEvent: "/event/deleteEvent",
  withdrawEventApprovalRequest: "/event/withdraw-event-approval-request",

  getBookedUsersList: "/event/bookings/booked-users",
  fetchLiveEvents: "/event/fetch-all-live"
};

export const adminEndPoints: IAdminEndPoints = {
  getAllUsers: "/account/admin/getAllUsers",
  blockOrUnblockUser: "/account/admin/blockOrUnblockUser",
  getAllOrganizers: "account/admin/getAllOrganizers",
  getOrganizerDetails: "/account/admin/getOrganizerDetails",
  changeOrganizerStatus: "account/admin/changeOrganizerStatus",
  changeAdminPassword: "account/admin/changeAdminPassword",

  // Event Management endpoints
  getAllEventCategories: "/event/getAllEventCategories",
  changeEventCategoryStatus: "/event/changeCategoryStatus",
  getAllEventApprovalRequest: "/event/getAllEventApprovalRequest",
  getEventDetails: '/event/getEventDetails',
  getAllApprovedEvents: '/event/getAllApprovedEvents',
  changeEventStatus: '/event/changeEventStatus',
  eventBlockAndUnBlock: '/event/eventBlockAndUnblock',
  eventAcceptAndReject: '/event/eventAcceptAndReject',


};


export const commonEndPoints : ICommonEndPoints = {
  booking: '/event/bookings',
}
