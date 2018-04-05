import axios from "axios";
import * as api from "./api";

const URL = "http://localhost:3010";

export async function registerUser(
  headers: api.AuthOptional,
  request: api.RegisterUserRequest,
): Promise<api.RegisterUserResponse> {
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
  request: api.LoginUserRequest,
): Promise<api.LoginUserResponse> {
  const url = `${URL}/users/login`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
  });
  return response.data;
}

export async function updateUser(
  headers: api.AuthRequired,
  id: string,
  request: api.UpdateUserRequest,
): Promise<api.UpdateUserResponse> {
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
  headers: api.AuthRequired,
  id: string,
  request: api.DeleteUserRequest,
): Promise<api.DeleteUserResponse> {
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
  headers: api.AuthRequired,
  request: api.ListUsersRequest,
): Promise<api.ListUsersResponse> {
  const url = `${URL}/users/list`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  return response.data;
}

export async function createApartment(
  headers: api.AuthRequired,
  request: api.CreateApartmentRequest,
): Promise<api.CreateApartmentResponse> {
  const url = `${URL}/apartments/create`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  return response.data;
}

export async function updateApartment(
  headers: api.AuthRequired,
  id: string,
  request: api.UpdateApartmentRequest,
): Promise<api.UpdateApartmentResponse> {
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
  headers: api.AuthRequired,
  id: string,
): Promise<api.DeleteApartmentResponse> {
  const url = `${URL}/apartments/${id}`;
  const response = await axios({
    url,
    method: "DELETE",
    headers,
  });
  return response.data;
}

export async function listApartments(
  headers: api.AuthRequired,
  request: api.ListApartmentsRequest,
): Promise<api.ListApartmentsResponse> {
  const url = `${URL}/apartments/list`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  return response.data;
}
