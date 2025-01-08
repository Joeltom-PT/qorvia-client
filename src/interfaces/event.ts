export interface ICreateOnlineEventDetail {
  id?: string;
  name: string;
  categoryId: string;
  typeName: string;
  description: string;
  imageUrl: string | null;
}

export interface ICreateOfflineEventDetail {
  id?: string;
  name: string;
  categoryId: string;
  description: string;
  imageUrl: string | null;
  lat: number;
  lng: number;
  address: string;
}

export interface IEventCategory {
  id: string;
  name: string;
}

export interface IOnlineEventDetail {
  id: string;
  name: string;
  categoryId: string;
  eventType: string;
  description: string;
  imageUrl: string;
}

export interface IOfflineEventDetail {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  imageUrl: string;
  lat?: number;
  lng?: number;
  address?: string;
}

export interface IOnlineEventTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

export interface IOfflineEventTimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

export interface IOnlineEventTickets {
  freeEvent?: boolean;
  totalTickets: string;
  isFreeEvent: boolean;
  price?: string;
  hasEarlyBirdDiscount: boolean;
  discountType?: string;
  discountValue?: string;
}

// export interface IOfflineEventTickets {
//     freeEvent?: boolean;
//     totalTickets: string;
//     isFreeEvent: boolean;
//     price?: string;
//     hasEarlyBirdDiscount: boolean;
//     discountType?: string;
//     discountValue?: string;
// }

export interface IEvent {
  id?: string;
  organizerId?: number;
  eventState?: string;
  name?: string;
  category?: string;
  eventType?: string;
  isOnline?: boolean;
  imageUrl?: string;
  eventFormStatus?: string;
  totalTickets?: number;
  approvalStatus?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  startDateAndTime?: string;
  endDateAndTime?: string;
  duration?: string;
  collabrationRequest: any;
}

export interface TicketCategory {
  name: string;
  totalTickets: string;
  price: string;
  discountType: "percentage" | "fixed" | "none";
  discountValue: string;
  description: string;
}

export interface IOfflineEventTickets {
  totalTickets: number;
  categories: TicketCategory[];
}

export interface Event {
  eventId: string;
  organizerId: number;
  eventName: string;
  eventState: string;
  imgUrl: string;
  eventDescription: string;
  eventCategory: string;
  startDateAndTime: string;
  isOnline: boolean;
}

export interface FetchEventsResponse {
  events: Event[];
  totalPages: number;
  totalElements: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface FetchEventsParams {
  page: number;
  size: number;
  search?: string;
  isOnline?: boolean;
  categoryId?: string;
  organizerId?: string;
  date?: string;
}


export interface IOnlineEventData {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  isOnline: boolean;
  imageUrl: string;
  organizerId: number;
  onlineEventTicket: IOnlineEventTicket;
  timeSlots: IEventTimeSlot[];
  onlineEventSetting: IOnlineEventSetting;
}

export interface IOnlineEventTicket {
  totalTickets: number;
  freeEvent: boolean;
  price: number;
  hasEarlyBirdDiscount: boolean;
  discountType: string;
  discountValue: number;
}

export interface IEventTimeSlot {
  id: string;
  eventId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

export interface IOnlineEventSetting {
  startImmediately: boolean;
  bookingStartDate: string;
  bookingStartTime: string;
  continueUntilEvent: boolean;
  bookingEndDate: string;
  bookingEndTime: string;
  disableRefunds: boolean;
  refundPercentage: string;
  refundPolicy: string;
}


export interface IOfflineEventData {
  id: string;
  organizerId: number;
  name: string;
  isOnline: boolean;
  categoryId: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  address: string;
  lan: number;
  lon: number;
  timeSlots: IEventTimeSlot[];
  offlineEventTickets: IOfflineEventTicket;
  onlineEventSetting: IOnlineEventSetting;
}

export interface IOfflineEventTicket {
  totalTickets: number;
  categories: ITicketCategory[];
}

export interface ITicketCategory {
  name: string;
  totalTickets: number;
  price: number;
  discountType: string;
  discountValue: number;
  description: string;
}

export interface IEventTimeSlot {
  id: string;
  eventId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}
