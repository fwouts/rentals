import { ENTITIES, initConnection } from "@/db/connections";
import { createConnection } from "typeorm";

export async function initDatabase() {
  const connection = await createConnection({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: 5432,
    username: process.env.DB_USERNAME || "rentals-dev",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "rentals-dev",
    entities: ENTITIES,
    synchronize: true,
    logging: false,
  });
  initConnection(connection);
}
