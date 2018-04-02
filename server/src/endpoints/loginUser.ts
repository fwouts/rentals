import { LoginUserRequest, LoginUserResponse } from "../main";

export async function loginUser(
  request: LoginUserRequest,
): Promise<LoginUserResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
