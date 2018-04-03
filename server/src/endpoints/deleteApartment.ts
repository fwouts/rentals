import { AuthRequired, DeleteApartmentResponse } from "../api";

export async function deleteApartment(
  headers: AuthRequired,
  apartmentId: string,
): Promise<DeleteApartmentResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
