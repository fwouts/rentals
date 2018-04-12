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

export interface VerifyEmailRequest {
  token: string;
}

export type VerifyEmailResponse = LoginUserResponse;

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  authToken: string;
  userId: string;
  role: Role;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface DeleteUserRequest {
  password?: string;
}

export interface ListUsersRequest {
  filter?: ListUsersFilter;
  maxPerPage?: number;
  page?: number;
}

export interface ListUsersFilter {
  role?: Role;
  name?: string;
}

export interface ListUsersResponse {
  results: UserDetails[];
  totalResults: number;
  pageCount: number;
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

export interface CreateApartmentResponse {
  message: string;
  apartmentId: string;
}

export interface UpdateApartmentRequest {
  info: ApartmentInfo;
  realtorId?: string;
}

export interface ListApartmentsRequest {
  filter?: ListApartmentsFilter;
  maxPerPage?: number;
  page?: number;
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
  viewport?: Viewport;
}

export interface ListApartmentsResponse {
  results: ApartmentDetails[];
  totalResults: number;
  pageCount: number;
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

export interface Viewport {
  southWest: Coordinates;
  northEast: Coordinates;
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

export type RegisterUser_Response = {
  kind: "success";
  data: string;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "failure";
  data: string;
};

export type VerifyEmailAddress_Response = {
  kind: "success";
  data: VerifyEmailResponse;
} | {
  kind: "failure";
  data: string;
};

export type LoginUser_Response = {
  kind: "success";
  data: LoginUserResponse;
} | {
  kind: "failure";
  data: string;
};

export type CheckAuth_Response = {
  kind: "success";
  data: LoginUserResponse;
} | {
  kind: "failure";
  data: string;
};

export type UpdateUser_Response = {
  kind: "success";
  data: string;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "failure";
  data: string;
} | {
  kind: "notfound";
};

export type DeleteUser_Response = {
  kind: "success";
  data: string;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "notfound";
};

export type ListUsers_Response = {
  kind: "success";
  data: ListUsersResponse;
} | {
  kind: "unauthorized";
  data: string;
};

export type GetUser_Response = {
  kind: "success";
  data: UserDetails;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "notfound";
};

export type CreateApartment_Response = {
  kind: "success";
  data: CreateApartmentResponse;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "failure";
  data: string;
};

export type UpdateApartment_Response = {
  kind: "success";
  data: string;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "failure";
  data: string;
} | {
  kind: "notfound";
};

export type DeleteApartment_Response = {
  kind: "success";
  data: string;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "notfound";
};

export type ListApartments_Response = {
  kind: "success";
  data: ListApartmentsResponse;
} | {
  kind: "unauthorized";
  data: string;
};

export type GetApartment_Response = {
  kind: "success";
  data: ApartmentDetails;
} | {
  kind: "unauthorized";
  data: string;
} | {
  kind: "notfound";
};
