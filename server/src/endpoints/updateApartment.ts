import {
  AuthRequired,
  UpdateApartmentRequest,
  UpdateApartmentResponse,
} from "../main";

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
