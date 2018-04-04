import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";

export async function findNewestApartment(): Promise<Apartment> {
  return connection.manager.getRepository(Apartment).findOneOrFail({
    order: {
      added: "DESC",
    },
  });
}
