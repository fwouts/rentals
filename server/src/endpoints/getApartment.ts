import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { ApartmentDetails, AuthRequired } from "../api";

export async function getApartment(
  headers: AuthRequired,
  apartmentId: string,
): Promise<ApartmentDetails> {
  const currentUser = await authenticate(headers.Authorization);
  const apartment = await connection.manager.findOneById(
    Apartment,
    apartmentId,
  );
  if (!apartment) {
    throw new Error("No such apartment.");
  }
  if (apartment.rented) {
    if (currentUser.role === "client") {
      throw new Error("Clients cannot see rented apartments.");
    }
    if (
      currentUser.role === "realtor" &&
      apartment.realtor.userId !== currentUser.userId
    ) {
      throw new Error("Realtors cannot see others' rented apartments.");
    }
  }
  return Apartment.toApi(apartment);
}
