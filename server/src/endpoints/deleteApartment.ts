import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { AuthRequired, DeleteApartment_Response } from "../api";

export async function deleteApartment(
  headers: AuthRequired,
  apartmentId: string,
): Promise<DeleteApartment_Response> {
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
    apartmentId,
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
        data: "Clients cannot delete apartment listings.",
      };
    case "realtor":
      if (apartment.realtor.userId !== currentUser.userId) {
        return {
          kind: "unauthorized",
          data: "Realtors cannot delete other realtors' apartment listings.",
        };
      }
      await connection.manager.delete(Apartment, {
        apartmentId,
        realtor: currentUser,
      });
      return {
        kind: "success",
        data: "The apartment listing was deleted successfully.",
      };
    case "admin":
      await connection.manager.delete(Apartment, {
        apartmentId,
      });
      return {
        kind: "success",
        data: "The apartment listing was deleted successfully.",
      };
    default:
      throw new Error(`Unknown role: ${currentUser.role}.`);
  }
}
