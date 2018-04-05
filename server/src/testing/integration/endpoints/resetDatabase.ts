import { connection } from "@/db/connections";
import { Apartment } from "@/db/entities/apartment";
import { User } from "@/db/entities/user";

export async function resetDatabase(): Promise<void> {
  // Delete all records.
  await connection.manager
    .createQueryBuilder()
    .delete()
    .from(Apartment)
    .where("true")
    .execute();
  await connection.manager
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("true")
    .execute();
}
