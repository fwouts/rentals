import {
  AuthRequired,
  ListApartmentsRequest,
  ListApartmentsResponse,
} from "../main";

export async function listApartments(
  headers: AuthRequired,
  request: ListApartmentsRequest,
): Promise<ListApartmentsResponse> {
  return {
    results: [],
    totalResults: 0,
  };
}
