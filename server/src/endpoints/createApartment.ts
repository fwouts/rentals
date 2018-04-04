import { decodeJwt } from "@/auth/jwt";
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
  const { userId, role } = decodeJwt(headers.Authorization);
  let realtorId;
  switch (role) {
    case "client":
      return {
        status: "error",
        message: "Clients cannot create apartment listings.",
      };
    case "realtor":
      realtorId = userId;
      break;
    case "admin":
      realtorId = request.realtorId || userId;
      break;
    default:
      throw new Error(`Unknown role: ${role}.`);
  }
  const apartment = Apartment.create(request.info, realtorId);
  await connection.manager.save(apartment);
  return {
    status: "success",
    apartmentId: apartment.apartmentId,
    message: "Apartment listing was created successfully.",
  };
}
