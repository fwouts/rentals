import { listUsers } from "@/endpoints/listUsers";
import { useTestingDatabase } from "@/testing/db";
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
    kind: "unauthorized",
    data: "Invalid credentials.",
  });
  expect(
    await listUsers(await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD), {}),
  ).toEqual({
    kind: "unauthorized",
    data: "Only admins can list users.",
  });
  expect(
    await listUsers(await authHeaders(REALTOR_HELENA, HELENA_PASSWORD), {}),
  ).toEqual({
    kind: "unauthorized",
    data: "Only admins can list users.",
  });
});

test("admins can list users", async () => {
  const response = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {},
  );
  if (response.kind !== "success") {
    throw expect(response).toMatchObject({
      kind: "success",
    });
  }
  expect(response.data.results.length).toBe(6);
  expect(response.data.totalResults).toBe(6);
  expect(response.data.pageCount).toBe(1);
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
  if (clients.kind !== "success") {
    throw expect(clients).toMatchObject({
      kind: "success",
    });
  }
  expect(clients.data.results.length).toBe(2);
  expect(clients.data.results.map((u) => u.role)).toEqual(["client", "client"]);
  expect(clients.data.totalResults).toBe(2);

  const realtors = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        role: "realtor",
      },
    },
  );
  if (realtors.kind !== "success") {
    throw expect(realtors).toMatchObject({
      kind: "success",
    });
  }
  expect(realtors.data.results.length).toBe(2);
  expect(realtors.data.results.map((u) => u.role)).toEqual([
    "realtor",
    "realtor",
  ]);
  expect(realtors.data.totalResults).toBe(2);

  const admins = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        role: "admin",
      },
    },
  );
  if (admins.kind !== "success") {
    throw expect(admins).toMatchObject({
      kind: "success",
    });
  }
  expect(admins.data.results.length).toBe(2);
  expect(admins.data.results.map((u) => u.role)).toEqual(["admin", "admin"]);
  expect(admins.data.totalResults).toBe(2);

  const filteredNames = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      filter: {
        name: "na",
      },
    },
  );
  if (filteredNames.kind !== "success") {
    throw expect(filteredNames).toMatchObject({
      kind: "success",
    });
  }
  expect(filteredNames.data.results.length).toBe(2);
  expect(filteredNames.data.results.map((u) => u.name)).toEqual([
    "Anna",
    "Helena",
  ]);
  expect(filteredNames.data.totalResults).toBe(2);
});

test("users pagination", async () => {
  const usersPerPage = 3;
  const page1 = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      maxPerPage: usersPerPage,
      page: 1,
    },
  );
  if (page1.kind !== "success") {
    throw expect(page1).toMatchObject({
      kind: "success",
    });
  }
  expect(page1.data.results.length).toBe(3);
  expect(page1.data.totalResults).toBe(6);
  expect(page1.data.pageCount).toBe(2);
  const page2 = await listUsers(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    {
      maxPerPage: usersPerPage,
      page: 2,
    },
  );
  if (page2.kind !== "success") {
    throw expect(page2).toMatchObject({
      kind: "success",
    });
  }
  expect(page2.data.results.length).toBe(3);
  expect(page2.data.totalResults).toBe(6);
  expect(page2.data.pageCount).toBe(2);
});
