import { connection, ENTITIES, initConnection } from "@/db/connections";
import { Connection, createConnection } from "typeorm";

/**
 * Sets up a test-only database connection.
 */
export function useTestingDatabase() {
  beforeEach(async () => {
    await wipeData();
    const testConnection = await createTestOnlyConnection();
    initConnection(testConnection);
  });

  afterEach(async () => {
    if (connection) {
      connection.close();
    }
  });
}

async function wipeData() {
  const testConnection = await createTestOnlyConnection({
    forWiping: true,
  });
  await testConnection.query('DROP TABLE IF EXISTS "apartment", "user";');
  await testConnection.close();
}

async function createTestOnlyConnection(
  options: {
    forWiping?: boolean;
  } = {},
): Promise<Connection> {
  return createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "rentals-test",
    password: "",
    database: "rentals-test",
    entities: options.forWiping ? [] : ENTITIES,
    synchronize: true,
    logging: false,
  });
}
