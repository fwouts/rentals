import { checkAuth } from "@/endpoints/checkAuth";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
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

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("missing auth", async () => {
  const response = await checkAuth({
    Authorization: "",
  });
  expect(response).toMatchObject({
    status: "error",
    message: "Invalid credentials.",
  });
});

test("wrong auth", async () => {
  const response = await checkAuth({
    Authorization: "wrong!",
  });
  expect(response).toMatchObject({
    status: "error",
    message: "Invalid credentials.",
  });
});

test("client auth", async () => {
  const response = await checkAuth(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
  );
  expect(response).toMatchObject({
    status: "success",
    role: "client",
  });
});

test("realtor auth", async () => {
  const response = await checkAuth(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
  );
  expect(response).toMatchObject({
    status: "success",
    role: "realtor",
  });
});

test("admin auth", async () => {
  const response = await checkAuth(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
  );
  expect(response).toMatchObject({
    status: "success",
    role: "admin",
  });
});
