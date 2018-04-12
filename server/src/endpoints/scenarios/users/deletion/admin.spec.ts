import { deleteUser } from "@/endpoints/deleteUser";
import { useTestingDatabase } from "@/testing/db";
import {
  ADMIN_FRANK,
  ADMIN_GEORGE,
  authHeaders,
  CLIENT_BRIAN,
  createTestUsers,
  findUser,
  FRANK_PASSWORD,
  REALTOR_HELENA,
} from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("admins can delete their own account", async () => {
  const user = await findUser(ADMIN_FRANK);
  const response = await deleteUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      password: FRANK_PASSWORD,
    },
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "Your account was deleted successfully. Bye bye.",
  });
});

test("admins cannot delete their account without entering password", async () => {
  const user = await findUser(ADMIN_FRANK);
  const response = await deleteUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {},
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "For security reasons, a password must be provided.",
  });
});

test("admins cannot delete their account with an incorrect password", async () => {
  const user = await findUser(ADMIN_FRANK);
  const response = await deleteUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      password: "wrong password",
    },
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "Incorrect password.",
  });
});

test("admins can delete clients' accounts", async () => {
  const user = await findUser(CLIENT_BRIAN);
  const response = await deleteUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {},
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The account was deleted successfully.",
  });
});

test("admins can delete realtors' accounts", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await deleteUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {},
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The account was deleted successfully.",
  });
});

test("admins can delete other admins' accounts", async () => {
  const user = await findUser(ADMIN_GEORGE);
  const response = await deleteUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {},
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The account was deleted successfully.",
  });
});
