import { passwordValid } from "@/auth/salting";
import { updateUser } from "@/endpoints/updateUser";
import { verifyEmailAddress } from "@/endpoints/verifyEmailAddress";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import {
  authHeaders,
  createTestUsers,
  findUser,
  HELENA_PASSWORD,
  JOHN_PASSWORD,
  REALTOR_HELENA,
  REALTOR_JOHN,
} from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("realtors can update their own account", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await updateUser(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: HELENA_PASSWORD,
      newPassword: GOOD_PASSWORD_1,
    },
  );
  const userPendingVerification = await findUser(REALTOR_HELENA);
  await verifyEmailAddress({
    token: userPendingVerification.pendingEmailToken!,
  });
  expect(response).toMatchObject({
    status: "success",
    message: "Please check your email to confirm your new email address.",
  });
  const updatedUser = await findUser("newemail@gmail.com");
  expect(updatedUser).toMatchObject({
    email: "newemail@gmail.com",
    name: "New name",
    role: "realtor",
  });
  expect(passwordValid(GOOD_PASSWORD_1, updatedUser));
});

test("realtors cannot update their account without entering password", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await updateUser(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "For security reasons, a password must be provided.",
  });
});

test("realtors cannot update their account with an incorrect password", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await updateUser(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: "wrong password",
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Incorrect password.",
  });
});

test("realtors cannot update others' accounts", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await updateUser(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: HELENA_PASSWORD,
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Users can only update their own account.",
  });
});
