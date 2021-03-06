import { passwordValid } from "@/auth/salting";
import { updateUser } from "@/endpoints/updateUser";
import { verifyEmailAddress } from "@/endpoints/verifyEmailAddress";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
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

test("admins can update their own account", async () => {
  const user = await findUser(ADMIN_FRANK);
  const response = await updateUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: FRANK_PASSWORD,
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "Please check your email to confirm your new email address.",
  });
  const userPendingVerification = await findUser(ADMIN_FRANK);
  await verifyEmailAddress({
    token: userPendingVerification.pendingEmailToken!,
  });
  const updatedUser = await findUser("newemail@gmail.com");
  expect(updatedUser).toMatchObject({
    email: "newemail@gmail.com",
    name: "New name",
    role: "admin",
  });
  expect(passwordValid(GOOD_PASSWORD_1, updatedUser));
});

test("admins cannot update their account without entering password", async () => {
  const user = await findUser(ADMIN_FRANK);
  const response = await updateUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "For security reasons, a password must be provided.",
  });
  expect(await findUser(ADMIN_FRANK)).toEqual(user);
});

test("admins cannot update their account with an incorrect password", async () => {
  const user = await findUser(ADMIN_FRANK);
  const response = await updateUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: "wrong password",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    kind: "unauthorized",
    data: "Incorrect password.",
  });
  expect(await findUser(ADMIN_FRANK)).toEqual(user);
});

test("admins can update clients' accounts", async () => {
  const user = await findUser(CLIENT_BRIAN);
  const response = await updateUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The account was updated successfully.",
  });
  const updatedUser = await findUser("newemail@gmail.com");
  expect(updatedUser).toMatchObject({
    email: "newemail@gmail.com",
    name: "New name",
    role: "client",
  });
  expect(passwordValid(GOOD_PASSWORD_1, updatedUser));
});

test("admins can update realtors' accounts", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await updateUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The account was updated successfully.",
  });
  const updatedUser = await findUser("newemail@gmail.com");
  expect(updatedUser).toMatchObject({
    email: "newemail@gmail.com",
    name: "New name",
    role: "realtor",
  });
  expect(passwordValid(GOOD_PASSWORD_1, updatedUser));
});

test("admins can update other admins' accounts", async () => {
  const user = await findUser(ADMIN_GEORGE);
  const response = await updateUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    kind: "success",
    data: "The account was updated successfully.",
  });
  const updatedUser = await findUser("newemail@gmail.com");
  expect(updatedUser).toMatchObject({
    email: "newemail@gmail.com",
    name: "New name",
    role: "admin",
  });
  expect(passwordValid(GOOD_PASSWORD_1, updatedUser));
});
