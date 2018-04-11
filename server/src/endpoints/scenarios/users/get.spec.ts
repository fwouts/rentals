import { getUser } from "@/endpoints/getUser";
import { useTestingDatabase } from "@/testing/db";
import {
  ADMIN_FRANK,
  authHeaders,
  BRIAN_PASSWORD,
  CLIENT_ANNA,
  CLIENT_BRIAN,
  createTestUsers,
  findUser,
  FRANK_PASSWORD,
  HELENA_PASSWORD,
  REALTOR_HELENA,
} from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  await createTestUsers();
});

test("non-admins cannot get users", async () => {
  const user = await findUser(CLIENT_ANNA);
  await expect(
    getUser(
      {
        Authorization: "",
      },
      user.userId,
    ),
  ).rejects.toMatchObject({
    message: "Invalid session token.",
  });
  await expect(
    getUser(await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD), user.userId),
  ).rejects.toMatchObject({
    message: "Only admins can get users.",
  });
  await expect(
    getUser(await authHeaders(REALTOR_HELENA, HELENA_PASSWORD), user.userId),
  ).rejects.toMatchObject({
    message: "Only admins can get users.",
  });
});

test("admins can get users", async () => {
  const user = await findUser(CLIENT_ANNA);
  const response = await getUser(
    await authHeaders(ADMIN_FRANK, FRANK_PASSWORD),
    user.userId,
  );
  expect(response).toEqual({
    userId: user.userId,
    email: CLIENT_ANNA,
    name: "Anna",
    role: "client",
  });
});
