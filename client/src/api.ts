import axios from "axios";

const URL = "https://rentals.toptal.zenc.io";

export async function registerUser(
  headers: AuthOptional,
  request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  const url = `${URL}/users/register`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  return response.data;
}

export async function loginUser(
  request: LoginUserRequest,
): Promise<LoginUserResponse> {
  const url = `${URL}/users/login`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
  });
  return response.data;
}

export async function updateUser(
  headers: AuthRequired,
  id: string,
  request: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  const url = `${URL}/users/${id}`;
  const response = await axios({
    url,
    method: "PUT",
    data: request,
    headers,
  });
  return response.data;
}

export async function deleteUser(
  headers: AuthRequired,
  id: string,
  request: DeleteUserRequest,
): Promise<DeleteUserResponse> {
  const url = `${URL}/users/${id}`;
  const response = await axios({
    url,
    method: "DELETE",
    data: request,
    headers,
  });
  return response.data;
}

export async function listUsers(
  headers: AuthRequired,
  request: ListUsersRequest,
): Promise<ListUsersResponse> {
  const url = `${URL}/users`;
  const response = await axios({
    url,
    method: "GET",
    data: request,
    headers,
  });
  return response.data;
}

export async function createApartment(
  headers: AuthRequired,
  request: CreateApartmentRequest,
): Promise<CreateApartmentResponse> {
  const url = `${URL}/apartments`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  return response.data;
}

export async function updateApartment(
  headers: AuthRequired,
  id: string,
  request: UpdateApartmentRequest,
): Promise<UpdateApartmentResponse> {
  const url = `${URL}/apartments/${id}`;
  const response = await axios({
    url,
    method: "PUT",
    data: request,
    headers,
  });
  return response.data;
}

export async function deleteApartment(
  headers: AuthRequired,
  id: string,
): Promise<DeleteApartmentResponse> {
  const url = `${URL}/apartments/${id}`;
  const response = await axios({
    url,
    method: "DELETE",
    headers,
  });
  return response.data;
}

export async function listApartments(
  headers: AuthRequired,
  request: ListApartmentsRequest,
): Promise<ListApartmentsResponse> {
  const url = `${URL}/apartments`;
  const response = await axios({
    url,
    method: "GET",
    data: request,
    headers,
  });
  return response.data;
}

export interface AuthOptional {
  Authorization?: string;
}

export interface AuthRequired {
  Authorization: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
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

export type LoginUserResponse =
  | {
      status: "error";
      message: string;
    }
  | {
      status: "success";
      jwtToken: string;
      role: Role;
    };

export interface UpdateUserRequest {
  email?: string;
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
  id: string;
  email: string;
  role: Role;
}

export type Role = "client" | "realtor" | "admin";

export interface CreateApartmentRequest {
  info: ApartmentInfo;
  realtorId?: string;
}

export interface CreateApartmentResponse {
  status: "success" | "error";
  message: string;
}

export interface UpdateApartmentRequest {
  info: ApartmentInfo;
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
  filter?: {
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
  };
  pageToken?: string;
}

export interface ListApartmentsResponse {
  results: ApartmentDetails[];
  totalResults: number;
  nextPageToken?: string;
}

export interface ApartmentDetails {
  info: ApartmentInfo;
  realtor: Realtor;
  dateAdded: Date;
}

export interface ApartmentInfo {
  id: string;
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
  id: string;
  name: string;
}
