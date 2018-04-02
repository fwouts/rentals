import { AuthRequired, ListUsersRequest, ListUsersResponse } from "../main";

export async function listUsers(
  headers: AuthRequired,
  request: ListUsersRequest,
): Promise<ListUsersResponse> {
  return {
    results: [],
    totalResults: 0,
  };
}
