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
      // TODO: Clean this up.
      apartment.floorArea = request.info.floorArea;
      apartment.pricePerMonth = request.info.pricePerMonth;
      apartment.numberOfRooms = request.info.numberOfRooms;
      apartment.latitude = request.info.coordinates.latitude;
      apartment.longitude = request.info.coordinates.longitude;
      apartment.rented = request.info.rented;
      await connection.manager.save(apartment);
      return {
        status: "success",
        message: "The apartment listing was updated successfully.",
      };
    case "admin":
      // TODO: Clean this up.
      apartment.floorArea = request.info.floorArea;
      apartment.pricePerMonth = request.info.pricePerMonth;
      apartment.numberOfRooms = request.info.numberOfRooms;
      apartment.latitude = request.info.coordinates.latitude;
      apartment.longitude = request.info.coordinates.longitude;
      apartment.rented = request.info.rented;
      if (request.realtorId) {
        apartment.realtor = new User();
        apartment.realtor.userId = request.realtorId;
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
