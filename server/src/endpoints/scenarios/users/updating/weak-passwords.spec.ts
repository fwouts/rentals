import { User } from "@/db/entities/user";
import { registerUser } from "@/endpoints/registerUser";
import { updateUser } from "@/endpoints/updateUser";
import { verifyEmailAddress } from "@/endpoints/verifyEmailAddress";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import { authHeaders, findUser } from "@/testing/users";
import "jest";
import uuid from "uuid";

useTestingDatabase();

test("weak passwords are rejected", async () => {
  await expectRejected(
    "short",
    "Password too weak: The password must be at least 8 characters long.",
  );
  await expectRejected(
    "password",
    "Password too weak: The password must contain at least one uppercase letter.",
  );
  await expectRejected(
    "passw0rd",
    "Password too weak: The password must contain at least one uppercase letter.",
  );
  await expectAccepted("pAssw0rd");
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
    kind: "failure",
    data: expectedMessage,
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
    kind: "success",
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
    kind: "success",
    data: "Great! Please check your email inbox now.",
  });
  const user = await findUser(email);
  await verifyEmailAddress({
    token: user.pendingEmailToken!,
  });
  return user;
}
