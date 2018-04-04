import { decodeJwt } from "@/auth/jwt";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { AuthRequired, DeleteApartmentResponse } from "../api";

export async function deleteApartment(
  headers: AuthRequired,
  apartmentId: string,
): Promise<DeleteApartmentResponse> {
  const { userId, role } = decodeJwt(headers.Authorization);
  const apartment = await connection.manager.getRepository(Apartment).findOne({
    apartmentId,
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
        message: "Clients cannot delete apartment listings.",
      };
    case "realtor":
      if (apartment.realtor.userId !== userId) {
        return {
          status: "error",
          message: "Realtors cannot delete other realtors' apartment listings.",
        };
      }
      await connection.manager.delete(Apartment, {
        apartmentId,
        realtor: {
          userId,
        },
      });
      return {
        status: "success",
        message: "The apartment listing was deleted successfully.",
      };
    case "admin":
      await connection.manager.delete(Apartment, {
        apartmentId,
      });
      return {
        status: "success",
        message: "The apartment listing was deleted successfully.",
      };
    default:
      throw new Error(`Unknown role: ${role}.`);
  }
}
