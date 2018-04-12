import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { User } from "@/db/entities/user";
import {
  AuthRequired,
  UpdateApartment_Response,
  UpdateApartmentRequest,
} from "../api";

export async function updateApartment(
  headers: AuthRequired,
  apartmentId: string,
  request: UpdateApartmentRequest,
): Promise<UpdateApartment_Response> {
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch (e) {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  const apartment = await connection.manager.findOne(Apartment, {
    where: {
      apartmentId,
    },
  });
  if (!apartment) {
    return {
      kind: "notfound",
    };
  }
  switch (currentUser.role) {
    case "client":
      return {
        kind: "unauthorized",
        data: "Clients cannot update apartment listings.",
      };
    case "realtor":
      if (apartment.realtor.userId !== currentUser.userId) {
        return {
          kind: "unauthorized",
          data: "Realtors cannot update other realtors' apartment listings.",
        };
      }
      if (request.realtorId) {
        return {
          kind: "unauthorized",
          data: "Realtors cannot reassign apartments to other realtors.",
        };
      }
      Apartment.updateInfo(apartment, request.info);
      await connection.manager.save(apartment);
      return {
        kind: "success",
        data: "The apartment listing was updated successfully.",
      };
    case "admin":
      Apartment.updateInfo(apartment, request.info);
      if (request.realtorId) {
        apartment.realtor = new User(request.realtorId);
      }
      await connection.manager.save(apartment);
      return {
        kind: "success",
        data: "The apartment listing was updated successfully.",
      };
    default:
      throw new Error(`Unknown role: ${currentUser.role}.`);
  }
}
