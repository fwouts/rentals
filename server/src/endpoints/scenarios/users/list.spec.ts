import { listUsers } from "@/endpoints/listUsers";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import {
  ADMIN_FRANK,
  authHeaders,
  BRIAN_PASSWORD,
  CLIENT_BRIAN,
  createTestUsers,
  FRANK_PASSWORD,
  HELENA_PASSWORD,
  REALTOR_HELENA,
} from "@/testing/users";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("non-admins cannot list users", async () => {
  expect(
    await listUsers(
      {
        Authorization: "",
      },
      {},
    ),
  ).toEqual({
    results: [],
    totalResults: 0,
    pageCount: 0,
  });
  expect(
    await listUsers(await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD), {}),
  ).toEqual({
    results: [],
    totalResults: 0,
    pageCount: 0,
  });
  expect(
    await listUsers(await authHeaders(REALTOR_HELENA, HELENA_PASSWORD), {}),
  ).toEqual({
    results: [],
    totalResults: 0,
    pageCount: 0,
  });
});

test("admins can list users", async () => {
  const response = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {},
  );
  expect(response.results.length).toBe(6);
  expect(response.totalResults).toBe(6);
  expect(response.pageCount).toBe(1);
});

test("users filtering", async () => {
  const clients = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        role: "client",
      },
    },
  );
  expect(clients.results.length).toBe(2);
  expect(clients.results.map((u) => u.role)).toEqual(["client", "client"]);
  expect(clients.totalResults).toBe(2);

  const realtors = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        role: "realtor",
      },
    },
  );
  expect(realtors.results.length).toBe(2);
  expect(realtors.results.map((u) => u.role)).toEqual(["realtor", "realtor"]);
  expect(realtors.totalResults).toBe(2);

  const admins = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        role: "admin",
      },
    },
  );
  expect(admins.results.length).toBe(2);
  expect(admins.results.map((u) => u.role)).toEqual(["admin", "admin"]);
  expect(admins.totalResults).toBe(2);
});

test("users pagination", async () => {
  const usersPerPage = 3;
  const page1 = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      page: 1,
    },
    usersPerPage,
  );
  expect(page1.results.length).toBe(3);
  expect(page1.totalResults).toBe(6);
  expect(page1.pageCount).toBe(2);
  const page2 = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      page: 2,
    },
    usersPerPage,
  );
  expect(page2.results.length).toBe(3);
  expect(page2.totalResults).toBe(6);
  expect(page2.pageCount).toBe(2);
});
