export interface IOrganizerState {
  loading: boolean;
  isLogged: boolean;
  error: string | null;
  success: boolean | null;
  profile: IOrganizerProfile | null;
}

export interface IOrganizerProfile {
  id: string;
  name: string;
  email: string;
  verificationStatus: string;
  registerRequestStatus: string;
  status: string;
  role: string;
}

export interface IOrganizerRegisterRequest {
  organizationName: string;
  email: string;
  password: string;
  repeatPassword: string;
  phone: number;
  website?: string;
  address: string;
  address2?: string;
  city: string;
  country: string;
  state: string;
  // PinCode: number;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  profileImage: string;
  about: string;
}

export interface IOrganizerRegisterResponse {
  statusCode: number;
  message: string;
}

export interface IOrganizerLoginRequest {
  email: string;
  password: string;
}

export interface IOrganizerLoginResponse {
  statusCode: number;
  message: string;
  data: IOrganizerProfile;
}

export interface IEmailVerificationRequest {
  email: string;
}

export interface IVerifyOrganzierRequest {
  token: string;
}

export interface IOrganizerVerificationResponse {
  statusCode: number;
  message: string;
  data: {
    email: string;
  } | null;
}

export interface IEventCategoryReqeust {
  name: string;
  description: string;
}

export interface IOrganizerProfileView {
  organizationName: string;
  phone: bigint;
  website: string;
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
}

export interface IOrganizerSettings {
  isApprovalAllowed: boolean;
}

export interface IOrganizerData {
  id: number;
  name: string;
  imgUrl: string;
  totalFollowers: number;
  totalEvents: number;
  isFollowing: boolean;
}

export interface IOrganizerProfileData {
  id: number;
  organizationName: string;
  website: string;
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
  isFollowing: boolean;
  totalEvents: number;
  totalFollowers: number;
}
