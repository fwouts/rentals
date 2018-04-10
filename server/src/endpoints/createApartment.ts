import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import {
  AuthRequired,
  CreateApartmentRequest,
  CreateApartmentResponse,
} from "../api";

export async function createApartment(
  headers: AuthRequired,
  request: CreateApartmentRequest,
): Promise<CreateApartmentResponse> {
  const currentUser = await authenticate(headers.Authorization);
  let realtorId;
  switch (currentUser.role) {
    case "client":
      return {
        status: "error",
        message: "Clients cannot create apartment listings.",
      };
    case "realtor":
      realtorId = currentUser.userId;
      break;
    case "admin":
      realtorId = request.realtorId || currentUser.userId;
      break;
    default:
      throw new Error(`Unknown role: ${currentUser.role}.`);
  }
  const apartment = Apartment.create(request.info, realtorId);
  await connection.manager.save(apartment);
  return {
    status: "success",
    apartmentId: apartment.apartmentId,
    message: "Apartment listing was created successfully.",
  };
}
