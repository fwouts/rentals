import {
  AuthRequired,
  UpdateApartmentRequest,
  UpdateApartmentResponse,
} from "../api";

export async function updateApartment(
  headers: AuthRequired,
  id: string,
  request: UpdateApartmentRequest,
): Promise<UpdateApartmentResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
