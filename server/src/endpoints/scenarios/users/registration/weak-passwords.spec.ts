import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
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
  const response = await registerUser(
    {},
    {
      email: uuid.v4() + "@gmail.com",
      password,
      name: "Client",
      role: "client",
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: expectedMessage,
  });
}

async function expectAccepted(password: string) {
  const response = await registerUser(
    {},
    {
      email: uuid.v4() + "@gmail.com",
      password,
      name: "Client",
      role: "client",
    },
  );
  expect(response).toMatchObject({
    status: "success",
  });
}
