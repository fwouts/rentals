import { AuthRequired, DeleteUserRequest, DeleteUserResponse } from "../main";

export async function deleteUser(
  headers: AuthRequired,
  id: string,
  request: DeleteUserRequest,
): Promise<DeleteUserResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
