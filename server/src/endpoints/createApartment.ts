import {
  AuthRequired,
  CreateApartmentRequest,
  CreateApartmentResponse,
} from "../main";

export async function createApartment(
  headers: AuthRequired,
  request: CreateApartmentRequest,
): Promise<CreateApartmentResponse> {
  return {
    status: "error",
    message: "Not implemented.",
  };
}
