export interface IAdminState {
  loading: boolean;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  verificationStatus: string;
  status: string;
  pro_img: string;
}

export interface AllUsersWithPagination {
  users: UserData[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IGetAllUsersResponse {
  statusCode: number;
  message: string;
  data: AllUsersWithPagination;
}

export interface OrganizerData {
  id: number;
  name: string;
  email: string;
  verificationStatus: string;
  registerRequestStatus: string;
  status: string;
  role: string;
}

export interface AllOrganizersWithPagination {
  organizers: OrganizerData[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IGetAllOrganizersResponse {
  statusCode: number;
  message: string;
  data: AllOrganizersWithPagination;
}

export interface FetchAllUsersParams {
  page: number;
  size: number;
  search: string;
}

export interface FetchAllOrganizersParams {
  page: number;
  size: number;
  search: string;
  status: string;
}

export interface IAdminSideOrganizerDetail {
  id: number;
  organizationName: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  address2?: string;
  city: string;
  country: string;
  state: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  profileImage?: string;
  about?: string;
  totalEvents: number;
  registrationStatus: string;
  status: string;
  verificationStatus: string;
}

export interface IAdminSideOrganizerDetailReponse {
  statusCode: number;
  message: string;
  data: IAdminSideOrganizerDetail;
}

export interface IAdminSideOrganizerDetailReqeust {
  id: number;
}

export interface IOrganizerStatusChangeRequest {
  registrationStatus: string;
  status: string;
}

export interface IEventCategory {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface IGetAllCategoriesResponse {
  categories: IEventCategory[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface IGetAllEventCategoriesRequest {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

export interface IChangeEventCategoryRequest {
  id: string;
  status: string;
}

export interface IEventApproval {
  id: string;
  eventId: string;
  eventName: string;
  online: string;
  organizerName: string;
  approvalStatus: string;
}

export interface IEventApprovalResponse {
  eventApproval: IEventApproval[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export interface EventDto {
  id: string;
  organizerId?: number;
  eventState?: string;
  name?: string;
  categoryId?: string;
  eventType?: string;
  isOnline?: boolean;
  isBlocked?: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  lan?: number;
  lon?: number;
  eventFormStatus?: string;
  approvalStatus?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  timeSlots?: EventTimeSlotDto[];
  onlineEventTicket?: OnlineEventTicketDto;
  offlineEventTickets?: OfflineEventTicketsDto;
  eventSettingDto?: eventSettingDto;
}

export interface EventTimeSlotDto {
  id?: string;
  eventId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
}

export interface OnlineEventTicketDto {
  totalTickets?: number;
  isFreeEvent?: boolean;
  price?: number | null;
  hasEarlyBirdDiscount?: boolean;
  discountType?: string | null;
  discountValue?: number | null;
}

export interface OfflineEventTicketsDto {
  totalTickets?: number;
  categories?: TicketCategoryDto[];
}

export interface TicketCategoryDto {
  name?: string;
  totalTickets?: number;
  price?: number;
  discountType?: string | null;
  discountValue?: number | null;
  description?: string;
}

export interface eventSettingDto {
  startImmediately?: boolean;
  bookingStartDate?: string;
  bookingStartTime?: string;
  continueUntilEvent?: boolean;
  bookingEndDate?: string;
  bookingEndTime?: string;
  disableRefunds?: boolean;
  refundPercentage?: string | null;
  refundPolicy?: string;
}

export interface GetAllApprovedEventsRequest {
  page?: number;
  size?: number;
  search?: string;
  eventState?: string | null;
  isOnline?: boolean | null;
  categoryId?: string | null;
}

export interface EventInfo {
  eventId: string;
  eventName: string;
  eventState: string;
  isOnline: boolean;
  eventCategory: string;
  startDateAndTime: string;
  endDateAndTime: string;
}

export interface GetAllApprovedEventsResponse {
  events: EventInfo[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}
