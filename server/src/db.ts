import { ENTITIES, initConnection } from "@/db/connections";
import { createConnection } from "typeorm";

if (process.env.DB_HOST === undefined) {
  throw new Error(`Missing environment variable DB_HOST.`);
}
if (process.env.DB_USERNAME === undefined) {
  throw new Error(`Missing environment variable DB_USERNAME.`);
}
if (process.env.DB_PASSWORD === undefined) {
  throw new Error(`Missing environment variable DB_PASSWORD.`);
}
if (process.env.DB_DATABASE === undefined) {
  throw new Error(`Missing environment variable DB_DATABASE.`);
}

export async function initDatabase() {
  const connection = await createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ENTITIES,
    synchronize: true,
    logging: false,
  });
  initConnection(connection);
}
