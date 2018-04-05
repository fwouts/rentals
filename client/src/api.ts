export interface AuthOptional {
  Authorization?: string;
}

export interface AuthRequired {
  Authorization: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface RegisterUserResponse {
  status: "success" | "error";
  message: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export type LoginUserResponse = {
  status: "error";
  message: string;
} | {
  status: "success";
  jwtToken: string;
  userId: string;
  role: Role;
};

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateUserResponse {
  status: "success" | "error";
  message: string;
}

export interface DeleteUserRequest {
  password?: string;
}

export interface DeleteUserResponse {
  status: "success" | "error";
  message: string;
}

export interface ListUsersRequest {
  filter?: {
    role: Role;
  };
  pageToken?: string;
}

export interface ListUsersResponse {
  results: UserDetails[];
  totalResults: number;
  nextPageToken?: string;
}

export interface UserDetails {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export type Role = "client" | "realtor" | "admin";

export interface CreateApartmentRequest {
  info: ApartmentInfo;
  realtorId?: string;
}

export type CreateApartmentResponse = {
  status: "error";
  message: string;
} | {
  status: "success";
  message: string;
  apartmentId: string;
};

export interface UpdateApartmentRequest {
  info: ApartmentInfo;
  realtorId?: string;
}

export interface UpdateApartmentResponse {
  status: "success" | "error";
  message: string;
}

export interface DeleteApartmentResponse {
  status: "success" | "error";
  message: string;
}

export interface ListApartmentsRequest {
  filter?: ListApartmentsFilter;
  pageToken?: string;
}

export interface ListApartmentsFilter {
  realtorId?: string;
  rented?: boolean;
  sizeRange?: {
    min: number;
    max: number;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  numberOfRooms?: {
    min: number;
    max: number;
  };
}

export interface ListApartmentsResponse {
  results: ApartmentDetails[];
  totalResults: number;
  nextPageToken?: string;
}

export interface ApartmentDetails {
  apartmentId: string;
  info: ApartmentInfo;
  realtor: Realtor;
  dateAdded: Date;
}

export interface ApartmentInfo {
  floorArea: number;
  pricePerMonth: number;
  numberOfRooms: number;
  coordinates: Coordinates;
  rented: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type Date = number;

export interface Realtor {
  realtorId: string;
  name: string;
}
