export interface IBooking {
  id?: string;
  userId?: number;
  eventId?: string;
  paymentSessionId?: string;
  userName?: string;
  email?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  totalAmount?: number;
  totalDiscount?: number;
  isOnline?: boolean;
  paymentStatus?: string;
  tickets?: IBookingTicket[];
  eventInfo?: IEventInfo;
}

export interface IEventInfo {
  id?: string;
  name?: string;
  imageUrl?: string;
}

export interface IBookingTicket {
  name?: string;
  quantity?: number;
  ticketsInCategory?: number;
  price?: number;
  discountPrice?: number;
}

export interface IBookedUsersListResponse {
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
  bookedUsers: IBookedUsers[];
}

export interface IBookedUsers {
  userId: number;
  userName: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  tickets: IBookingTicket[];
}

export interface IUserBookingInfo {
  bookingId?: string;
  userId?: number;
  eventId?: string;
  isOnline?: boolean;
  eventName?: string;
  imageUrl?: string;
  totalAmount?: number;
  totalDiscount?: number;
  startTimeAndDate?: string;
  bookingStatus? : string;
  paymentStatus? : string;
  ticket?: IBookingTicket | null;
}
