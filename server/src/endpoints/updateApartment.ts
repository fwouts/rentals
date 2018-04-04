import { decodeJwt } from "@/auth/jwt";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { User } from "@/db/entities/user";
import {
  AuthRequired,
  UpdateApartmentRequest,
  UpdateApartmentResponse,
} from "../api";

export async function updateApartment(
  headers: AuthRequired,
  apartmentId: string,
  request: UpdateApartmentRequest,
): Promise<UpdateApartmentResponse> {
  const { userId, role } = decodeJwt(headers.Authorization);
  const apartment = await connection.manager.findOne(Apartment, {
    where: {
      apartmentId,
    },
  });
  if (!apartment) {
    return {
      status: "error",
      message: "No such apartment.",
    };
  }
  switch (role) {
    case "client":
      return {
        status: "error",
        message: "Clients cannot update apartment listings.",
      };
    case "realtor":
      if (apartment.realtor.userId !== userId) {
        return {
          status: "error",
          message: "Realtors cannot update other realtors' apartment listings.",
        };
      }
      if (request.realtorId) {
        return {
          status: "error",
          message: "Realtors cannot reassign apartments to other realtors.",
        };
      }
      Apartment.updateInfo(apartment, request.info);
      await connection.manager.save(apartment);
      return {
        status: "success",
        message: "The apartment listing was updated successfully.",
      };
    case "admin":
      Apartment.updateInfo(apartment, request.info);
      if (request.realtorId) {
        apartment.realtor = new User(request.realtorId);
      }
      await connection.manager.save(apartment);
      return {
        status: "success",
        message: "The apartment listing was updated successfully.",
      };
    default:
      throw new Error(`Unknown role: ${role}.`);
  }
}
