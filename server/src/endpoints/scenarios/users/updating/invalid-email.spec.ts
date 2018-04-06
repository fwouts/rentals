import { updateUser } from "@/endpoints/updateUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import {
  ANNA_PASSWORD,
  authHeaders,
  CLIENT_ANNA,
  createTestUsers,
  findUser,
} from "@/testing/users";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("account cannot be updated to an invalid email address", async () => {
  const response = await updateUser(
    await authHeaders(CLIENT_ANNA, ANNA_PASSWORD),
    (await findUser(CLIENT_ANNA)).userId,
    {
      email: "hello-gmail.com",
      currentPassword: ANNA_PASSWORD,
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Invalid email address format.",
  });
});
