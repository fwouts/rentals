import {
  AuthRequired,
  CreateApartmentRequest,
  CreateApartmentResponse,
} from "../api";

export async function createApartment(
  headers: AuthRequired,
  request: CreateApartmentRequest,
): Promise<CreateApartmentResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
