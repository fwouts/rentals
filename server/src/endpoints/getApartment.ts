import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { AuthRequired, GetApartment_Response } from "../api/types";

export async function getApartment(
  headers: AuthRequired,
  apartmentId: string,
): Promise<GetApartment_Response> {
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch (e) {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  const apartment = await connection.manager.findOneById(
    Apartment,
    apartmentId,
  );
  if (!apartment) {
    return {
      kind: "notfound",
    };
  }
  if (apartment.rented) {
    if (currentUser.role === "client") {
      return {
        kind: "unauthorized",
        data: "Clients cannot see rented apartments.",
      };
    }
    if (
      currentUser.role === "realtor" &&
      apartment.realtor.userId !== currentUser.userId
    ) {
      return {
        kind: "unauthorized",
        data: "Realtors cannot see others' rented apartments.",
      };
    }
  }
  return {
    kind: "success",
    data: Apartment.toApi(apartment),
  };
}
