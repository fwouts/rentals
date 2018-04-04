import { deleteUser } from "@/endpoints/deleteUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
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

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("clients can delete their own account", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await deleteUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
    user.userId,
    {
      password: ANNA_PASSWORD,
    },
  );
  expect(response).toMatchObject({
    status: "success",
    message: "Your account was deleted successfully. Bye bye.",
  });
});

test("clients cannot delete their account without entering password", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await deleteUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
    user.userId,
    {},
  );
  expect(response).toMatchObject({
    status: "error",
    message: "For security reasons, a password must be provided.",
  });
});

test("clients cannot delete their account with an incorrect password", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await deleteUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
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

test("clients cannot delete others' accounts", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await deleteUser(
    await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD),
    user.userId,
    {
      password: ANNA_PASSWORD,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Users can only delete their own account.",
  });
});
