import {
  AuthOptional,
  RegisterUserRequest,
  RegisterUserResponse,
} from "../api";

export async function registerUser(
  headers: AuthOptional,
  request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  return {
    status: "error",
    message: "Not implemented yet.",
  };
}
