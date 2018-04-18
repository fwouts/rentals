import axios, { AxiosError } from "axios";
import * as types from "./api/types";
import * as validators from "./api/validators";

const URL = "http://localhost:3010";

// start-generated-section endpoints
export async function registerUser(
  headers: types.AuthOptional,
  request: types.RegisterUserRequest,
): Promise<types.RegisterUser_Response> {
  if (!validators.validate_AuthOptional(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_RegisterUserRequest(request)) {
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
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validators.validate_string(data)) {
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
  request: types.VerifyEmailRequest,
): Promise<types.VerifyEmailAddress_Response> {
  if (!validators.validate_VerifyEmailRequest(request)) {
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
      if (!validators.validate_VerifyEmailResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 409:
      if (!validators.validate_string(data)) {
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
  request: types.LoginUserRequest,
): Promise<types.LoginUser_Response> {
  if (!validators.validate_LoginUserRequest(request)) {
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
      if (!validators.validate_LoginUserResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 401:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
): Promise<types.CheckAuth_Response> {
  if (!validators.validate_AuthRequired(headers)) {
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
      if (!validators.validate_LoginUserResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 401:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  id: string,
  request: types.UpdateUserRequest,
): Promise<types.UpdateUser_Response> {
  if (!validators.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_UpdateUserRequest(request)) {
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
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  id: string,
  request: types.DeleteUserRequest,
): Promise<types.DeleteUser_Response> {
  if (!validators.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_DeleteUserRequest(request)) {
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
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  request: types.ListUsersRequest,
): Promise<types.ListUsers_Response> {
  if (!validators.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_ListUsersRequest(request)) {
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
      if (!validators.validate_ListUsersResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  id: string,
): Promise<types.GetUser_Response> {
  if (!validators.validate_AuthRequired(headers)) {
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
      if (!validators.validate_UserDetails(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  request: types.CreateApartmentRequest,
): Promise<types.CreateApartment_Response> {
  if (!validators.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_CreateApartmentRequest(request)) {
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
      if (!validators.validate_CreateApartmentResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  id: string,
  request: types.UpdateApartmentRequest,
): Promise<types.UpdateApartment_Response> {
  if (!validators.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_UpdateApartmentRequest(request)) {
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
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "unauthorized",
        data,
      };
    case 409:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  id: string,
): Promise<types.DeleteApartment_Response> {
  if (!validators.validate_AuthRequired(headers)) {
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
      if (!validators.validate_string(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  request: types.ListApartmentsRequest,
): Promise<types.ListApartments_Response> {
  if (!validators.validate_AuthRequired(headers)) {
    throw new Error(`Invalid headers: ${JSON.stringify(headers, null, 2)}`);
  }
  if (!validators.validate_ListApartmentsRequest(request)) {
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
      if (!validators.validate_ListApartmentsResponse(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
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
  headers: types.AuthRequired,
  id: string,
): Promise<types.GetApartment_Response> {
  if (!validators.validate_AuthRequired(headers)) {
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
      if (!validators.validate_ApartmentDetails(data)) {
        throw new Error(`Invalid response: ${JSON.stringify(data, null, 2)}`);
      }
      return {
        kind: "success",
        data,
      };
    case 403:
      if (!validators.validate_string(data)) {
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
// end-generated-section endpoints
