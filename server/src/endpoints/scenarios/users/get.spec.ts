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
  expect(
    await getUser(
      {
        Authorization: "",
      },
      user.userId,
    ),
  ).toMatchObject({
    kind: "unauthorized",
    data: "Invalid credentials.",
  });
  expect(
    await getUser(await authHeaders(CLIENT_BRIAN, BRIAN_PASSWORD), user.userId),
  ).toMatchObject({
    kind: "unauthorized",
    data: "Only admins can get users.",
  });
  expect(
    await getUser(
      await authHeaders(REALTOR_HELENA, HELENA_PASSWORD),
      user.userId,
    ),
  ).toMatchObject({
    kind: "unauthorized",
    data: "Only admins can get users.",
  });
});

test("admins can get users", async () => {
  const user = await findUser(CLIENT_ANNA);
  expect(
    await getUser(await authHeaders(ADMIN_FRANK, FRANK_PASSWORD), user.userId),
  ).toEqual({
    kind: "success",
    data: {
      userId: user.userId,
      email: CLIENT_ANNA,
      name: "Anna",
      role: "client",
    },
  });
});
