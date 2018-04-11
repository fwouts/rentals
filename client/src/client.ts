import axios from "axios";
import * as api from "./api";
import * as validation from "./validation";

const URL = "http://localhost:3010";

export async function registerUser(
  headers: api.AuthOptional,
  request: api.RegisterUserRequest,
): Promise<api.RegisterUserResponse> {
  if (!validation.validate_AuthOptional(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_RegisterUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/register`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  if (!validation.validate_RegisterUserResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function verifyEmailAddress(
  request: api.VerifyEmailRequest,
): Promise<api.VerifyEmailResponse> {
  if (!validation.validate_VerifyEmailRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/verify`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
  });
  if (!validation.validate_VerifyEmailResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function loginUser(
  request: api.LoginUserRequest,
): Promise<api.LoginUserResponse> {
  if (!validation.validate_LoginUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/login`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
  });
  if (!validation.validate_LoginUserResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function checkAuth(
  headers: api.AuthRequired,
): Promise<api.LoginUserResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/users/auth`;
  const response = await axios({
    url,
    method: "POST",
    headers,
  });
  if (!validation.validate_LoginUserResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function updateUser(
  headers: api.AuthRequired,
  id: string,
  request: api.UpdateUserRequest,
): Promise<api.UpdateUserResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_UpdateUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/${id}`;
  const response = await axios({
    url,
    method: "PUT",
    data: request,
    headers,
  });
  if (!validation.validate_UpdateUserResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function deleteUser(
  headers: api.AuthRequired,
  id: string,
  request: api.DeleteUserRequest,
): Promise<api.DeleteUserResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_DeleteUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/${id}`;
  const response = await axios({
    url,
    method: "DELETE",
    data: request,
    headers,
  });
  if (!validation.validate_DeleteUserResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function listUsers(
  headers: api.AuthRequired,
  request: api.ListUsersRequest,
): Promise<api.ListUsersResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_ListUsersRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/list`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  if (!validation.validate_ListUsersResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function getUser(
  headers: api.AuthRequired,
  id: string,
): Promise<api.UserDetails> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/users/${id}`;
  const response = await axios({
    url,
    method: "GET",
    headers,
  });
  if (!validation.validate_UserDetails(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function createApartment(
  headers: api.AuthRequired,
  request: api.CreateApartmentRequest,
): Promise<api.CreateApartmentResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_CreateApartmentRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/apartments/create`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  if (!validation.validate_CreateApartmentResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function updateApartment(
  headers: api.AuthRequired,
  id: string,
  request: api.UpdateApartmentRequest,
): Promise<api.UpdateApartmentResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_UpdateApartmentRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/apartments/${id}`;
  const response = await axios({
    url,
    method: "PUT",
    data: request,
    headers,
  });
  if (!validation.validate_UpdateApartmentResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function deleteApartment(
  headers: api.AuthRequired,
  id: string,
): Promise<api.DeleteApartmentResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/apartments/${id}`;
  const response = await axios({
    url,
    method: "DELETE",
    headers,
  });
  if (!validation.validate_DeleteApartmentResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function listApartments(
  headers: api.AuthRequired,
  request: api.ListApartmentsRequest,
): Promise<api.ListApartmentsResponse> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_ListApartmentsRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/apartments/list`;
  const response = await axios({
    url,
    method: "POST",
    data: request,
    headers,
  });
  if (!validation.validate_ListApartmentsResponse(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}

export async function getApartment(
  headers: api.AuthRequired,
  id: string,
): Promise<api.ApartmentDetails> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/apartments/${id}`;
  const response = await axios({
    url,
    method: "GET",
    headers,
  });
  if (!validation.validate_ApartmentDetails(response.data)) {
    throw new Error(
      `Invalid response: ${JSON.stringify(response.data, null, 2)}`,
    );
  }
  return response.data;
}
