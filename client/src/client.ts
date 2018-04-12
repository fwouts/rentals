import axios, { AxiosError } from "axios";
import * as api from "./api";
import * as validation from "./validation";

const URL = "http://localhost:3010";

export async function registerUser(
  headers: api.AuthOptional,
  request: api.RegisterUserRequest,
): Promise<api.RegisterUser_Response> {
  if (!validation.validate_AuthOptional(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_RegisterUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/register`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function verifyEmailAddress(
  request: api.VerifyEmailRequest,
): Promise<api.VerifyEmailAddress_Response> {
  if (!validation.validate_VerifyEmailRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/verify`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      data: request,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_VerifyEmailResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 409:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function loginUser(
  request: api.LoginUserRequest,
): Promise<api.LoginUser_Response> {
  if (!validation.validate_LoginUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/login`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      data: request,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_LoginUserResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 401:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function checkAuth(
  headers: api.AuthRequired,
): Promise<api.CheckAuth_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/users/auth`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_LoginUserResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 401:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function updateUser(
  headers: api.AuthRequired,
  id: string,
  request: api.UpdateUserRequest,
): Promise<api.UpdateUser_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_UpdateUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/${id}`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "PUT",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    case 404:
      return {
        kind: "notfound",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function deleteUser(
  headers: api.AuthRequired,
  id: string,
  request: api.DeleteUserRequest,
): Promise<api.DeleteUser_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_DeleteUserRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/${id}`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "DELETE",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 404:
      return {
        kind: "notfound",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function listUsers(
  headers: api.AuthRequired,
  request: api.ListUsersRequest,
): Promise<api.ListUsers_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_ListUsersRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/users/list`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_ListUsersResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function getUser(
  headers: api.AuthRequired,
  id: string,
): Promise<api.GetUser_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/users/${id}`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "json",
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_UserDetails(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 404:
      return {
        kind: "notfound",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function createApartment(
  headers: api.AuthRequired,
  request: api.CreateApartmentRequest,
): Promise<api.CreateApartment_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_CreateApartmentRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/apartments/create`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_CreateApartmentResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function updateApartment(
  headers: api.AuthRequired,
  id: string,
  request: api.UpdateApartmentRequest,
): Promise<api.UpdateApartment_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_UpdateApartmentRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/apartments/${id}`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "PUT",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "failure",
        data,
      };
    case 404:
      return {
        kind: "notfound",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function deleteApartment(
  headers: api.AuthRequired,
  id: string,
): Promise<api.DeleteApartment_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/apartments/${id}`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "DELETE",
      responseType: "json",
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 404:
      return {
        kind: "notfound",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function listApartments(
  headers: api.AuthRequired,
  request: api.ListApartmentsRequest,
): Promise<api.ListApartments_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validation.validate_ListApartmentsRequest(request)) {
    throw new Error(`Invalid request: ${JSON.stringify(request, null, 2)}`);
  }
  const url = `${URL}/apartments/list`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "POST",
      responseType: "json",
      data: request,
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_ListApartmentsResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}

export async function getApartment(
  headers: api.AuthRequired,
  id: string,
): Promise<api.GetApartment_Response> {
  if (!validation.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  const url = `${URL}/apartments/${id}`;
  let data: any;
  let statusCode: number;
  let statusText: string;
  try {
    const response = await axios({
      url,
      method: "GET",
      responseType: "json",
      headers,
    });
    data = response.data;
    statusCode = response.status;
    statusText = response.statusText;
  } catch (e) {
    const axiosError = e as AxiosError;
    if (axiosError.response) {
      data = axiosError.response.data;
      statusCode = axiosError.response.status;
      statusText = axiosError.response.statusText;
    } else {
      statusCode = 503;
      statusText = axiosError.code || axiosError.message;
    }
  }
  switch (statusCode) {
    case 200:
      if (!validation.validate_ApartmentDetails(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validation.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 404:
      return {
        kind: "notfound",
      };
    default:
      throw new Error(`Unexpected status: ${statusCode} ${statusText}`);
  }
}
