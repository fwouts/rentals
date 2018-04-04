import { User } from "@/db/entities/user";
import { registerUser } from "@/endpoints/registerUser";
import { updateUser } from "@/endpoints/updateUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import { authHeaders, findUser } from "@/testing/users";
import "jest";
import uuid from "uuid";

setUpJwtForTesting();
useTestingDatabase();

test("weak passwords are rejected", async () => {
  await expectRejected(
    "short",
    `Password too weak:
The password must be at least 8 characters long.
The password must contain at least one uppercase letter.
The password must contain at least one number.
The password must contain at least one special character.`,
  );
  await expectRejected(
    "password",
    `Password too weak:
The password must contain at least one uppercase letter.
The password must contain at least one number.
The password must contain at least one special character.`,
  );
  await expectRejected(
    "passw0rd",
    `Password too weak:
The password must contain at least one uppercase letter.
The password must contain at least one special character.`,
  );
  await expectAccepted("Passw0rd!");
});

async function expectRejected(password: string, expectedMessage: string) {
  const user = await createUser();
  const updateResponse = await updateUser(
    await authHeaders(user.email, GOOD_PASSWORD_1),
    user.userId,
    {
      currentPassword: GOOD_PASSWORD_1,
      newPassword: password,
    },
  );
  expect(updateResponse).toMatchObject({
    status: "error",
    message: expectedMessage,
  });
}

async function expectAccepted(password: string) {
  const user = await createUser();
  const updateResponse = await updateUser(
    await authHeaders(user.email, GOOD_PASSWORD_1),
    user.userId,
    {
      currentPassword: GOOD_PASSWORD_1,
      newPassword: password,
    },
  );
  expect(updateResponse).toMatchObject({
    status: "success",
  });
}

async function createUser(): Promise<User> {
  const email = uuid.v4() + "@gmail.com";
  const registerResponse = await registerUser(
    {},
    {
      email,
      password: GOOD_PASSWORD_1,
      name: "Client",
      role: "client",
    },
  );
  expect(registerResponse).toEqual({
    status: "success",
    message: "User successfully registered.",
  });
  return await findUser(email);
}
