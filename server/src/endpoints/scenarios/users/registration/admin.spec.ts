import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import {
  GOOD_PASSWORD_1,
  GOOD_PASSWORD_2,
  GOOD_PASSWORD_3,
  GOOD_PASSWORD_4,
} from "@/testing/passwords";
import { authHeaders } from "@/testing/users";
import "jest";

useTestingDatabase();

beforeEach(async () => {
  const admin = User.create(
    {
      email: "admin1@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Admin 1",
      role: "admin",
    },
    { verified: true },
  );
  const realtor = User.create(
    {
      email: "realtor@gmail.com",
      password: GOOD_PASSWORD_2,
      name: "Realtor",
      role: "realtor",
    },
    { verified: true },
  );
  const client = User.create(
    {
      email: "client@gmail.com",
      password: GOOD_PASSWORD_3,
      name: "Client",
      role: "client",
    },
    { verified: true },
  );
  await connection.manager.save([admin, realtor, client]);
});

test("only an admin can register another admin", async () => {
  const registerWithoutAuthorization = await registerUser(
    {},
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      name: "Admin 2",
      role: "admin",
    },
  );
  expect(registerWithoutAuthorization).toMatchObject({
    kind: "unauthorized",
    data: "Only an admin can register another admin.",
  });

  const registerWithRealtorAuthorization = await registerUser(
    await authHeaders("realtor@gmail.com", GOOD_PASSWORD_2),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      name: "Admin 2",
      role: "admin",
    },
  );
  expect(registerWithRealtorAuthorization).toMatchObject({
    kind: "unauthorized",
    data: "Only an admin can register another admin.",
  });

  const registerWithClientAuthorization = await registerUser(
    await authHeaders("client@gmail.com", GOOD_PASSWORD_3),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      name: "Admin 2",
      role: "admin",
    },
  );
  expect(registerWithClientAuthorization).toMatchObject({
    kind: "unauthorized",
    data: "Only an admin can register another admin.",
  });

  const registerWithAdminAuthorization = await registerUser(
    await authHeaders("admin1@gmail.com", GOOD_PASSWORD_1),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      name: "Admin 2",
      role: "admin",
    },
  );
  expect(registerWithAdminAuthorization).toMatchObject({
    kind: "success",
    data: "User successfully registered.",
  });
});

test("admin registration", async () => {
  const registerResponse = await registerUser(
    await authHeaders("admin1@gmail.com", GOOD_PASSWORD_1),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      name: "Admin 2",
      role: "admin",
    },
  );
  expect(registerResponse).toMatchObject({
    kind: "success",
    data: "User successfully registered.",
  });
  const incorrectLoginResponse = await loginUser({
    email: "admin2@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse).toMatchObject({
    kind: "failure",
    data: "Invalid credentials.",
  });
  const correctLoginResponse = await loginUser({
    email: "admin2@gmail.com",
    password: GOOD_PASSWORD_4,
  });
  if (correctLoginResponse.kind !== "success") {
    throw expect(correctLoginResponse).toMatchObject({
      kind: "success",
      data: {
        role: "admin",
      },
    });
  }
  expect(correctLoginResponse.data.authToken.length).toBeGreaterThan(5);
});
