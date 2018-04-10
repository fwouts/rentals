import { passwordValid } from "@/auth/salting";
import { updateUser } from "@/endpoints/updateUser";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import {
  ANNA_PASSWORD,
  authHeaders,
  BRIAN_PASSWORD,
  CLIENT_ANNA,
  CLIENT_BRIAN,
  createTestUsers,
  findUser,
} from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("clients can update their own account", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await updateUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: ANNA_PASSWORD,
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    status: "success",
    message: "Your account was updated successfully.",
  });
  const updatedUser = await findUser("newemail@gmail.com");
  expect(updatedUser).toMatchObject({
    email: "newemail@gmail.com",
    name: "New name",
    role: "client",
  });
  expect(passwordValid(GOOD_PASSWORD_1, updatedUser));
});

test("clients cannot update their account without entering password", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await updateUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
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

test("clients cannot update their account with an incorrect password", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await updateUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
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

test("clients cannot update others' accounts", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await updateUser(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    user.userId,
    {
      email: "newemail@gmail.com",
      name: "New name",
      currentPassword: ANNA_PASSWORD,
      newPassword: GOOD_PASSWORD_1,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Users can only update their own account.",
  });
});
