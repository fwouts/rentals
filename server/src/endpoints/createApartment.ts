import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import {
  AuthRequired,
  CreateApartment_Response,
  CreateApartmentRequest,
} from "../api/types";

export async function createApartment(
  headers: AuthRequired,
  request: CreateApartmentRequest,
): Promise<CreateApartment_Response> {
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch (e) {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  let realtorId;
  switch (currentUser.role) {
    case "client":
      return {
        kind: "unauthorized",
        data: "Clients cannot create apartment listings.",
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
    kind: "success",
    data: {
      apartmentId: apartment.apartmentId,
      message: "Apartment listing was created successfully.",
    },
  };
}
