import { deleteUser } from "@/endpoints/deleteUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
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

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("realtors can delete their own account", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await deleteUser(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    user.userId,
    {
      password: HELENA_PASSWORD,
    },
  );
  expect(response).toMatchObject({
    status: "success",
    message: "Your account was deleted successfully. Bye bye.",
  });
});

test("realtors cannot delete their account without entering password", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await deleteUser(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    user.userId,
    {},
  );
  expect(response).toMatchObject({
    status: "error",
    message: "For security reasons, a password must be provided.",
  });
});

test("realtors cannot delete their account with an incorrect password", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await deleteUser(
    await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
    user.userId,
    {
      password: "wrong password",
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Incorrect password.",
  });
});

test("realtors cannot delete others' accounts", async () => {
  const user = await findUser(REALTOR_HELENA);
  const response = await deleteUser(
    await authHeaders(REALTOR_JOHN, JOHN_PASSWORD),
    user.userId,
    {
      password: HELENA_PASSWORD,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Users can only delete their own account.",
  });
});
