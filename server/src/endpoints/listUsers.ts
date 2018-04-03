import { AuthRequired, ListUsersRequest, ListUsersResponse } from "../api";

export async function listUsers(
  headers: AuthRequired,
  request: ListUsersRequest,
): Promise<ListUsersResponse> {
  return {
    results: [],
    totalResults: 0,
  };
}
