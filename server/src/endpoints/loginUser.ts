import { LoginUserRequest, LoginUserResponse } from "../api";

export async function loginUser(
  request: LoginUserRequest,
): Promise<LoginUserResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
