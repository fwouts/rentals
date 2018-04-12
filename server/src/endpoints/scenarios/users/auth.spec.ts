import { checkAuth } from "@/endpoints/checkAuth";
import { useTestingDatabase } from "@/testing/db";
import {
  ADMIN_FRANK,
  ANNA_PASSWORD,
  authHeaders,
  CLIENT_ANNA,
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

test("missing auth", async () => {
  const response = await checkAuth({
    Authorization: "",
  });
  expect(response).toMatchObject({
    kind: "failure",
    data: "Invalid credentials.",
  });
});

test("wrong auth", async () => {
  const response = await checkAuth({
    Authorization: "wrong!",
  });
  expect(response).toMatchObject({
    kind: "failure",
    data: "Invalid credentials.",
  });
});

test("client auth", async () => {
  const response = await checkAuth(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
  );
  expect(response).toMatchObject({
    kind: "success",
    data: {
      role: "client",
    },
  });
});

test("realtor auth", async () => {
  const response = await checkAuth(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
  );
  expect(response).toMatchObject({
    kind: "success",
    data: {
      role: "realtor",
    },
  });
});

test("admin auth", async () => {
  const response = await checkAuth(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
  );
  expect(response).toMatchObject({
    kind: "success",
    data: {
      role: "admin",
    },
  });
});
