import { AuthRequired, UpdateUserRequest, UpdateUserResponse } from "../api";

export async function updateUser(
  headers: AuthRequired,
  userId: string,
  request: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
