import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import {
  GOOD_PASSWORD_1,
  GOOD_PASSWORD_2,
  GOOD_PASSWORD_3,
  GOOD_PASSWORD_4,
} from "@/testing/passwords";
import { authHeaders } from "@/testing/users";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  const admin = User.create({
    email: "admin1@gmail.com",
    password: GOOD_PASSWORD_1,
    role: "admin",
  });
  const realtor = User.create({
    email: "realtor@gmail.com",
    password: GOOD_PASSWORD_2,
    role: "realtor",
  });
  const client = User.create({
    email: "client@gmail.com",
    password: GOOD_PASSWORD_3,
    role: "client",
  });
  await connection.manager.save([admin, realtor, client]);
});

test("only an admin can register another admin", async () => {
  const registerWithoutAuthorization = await registerUser(
    {},
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      role: "admin",
    },
  );
  expect(registerWithoutAuthorization).toMatchObject({
    status: "error",
    message: "Only an admin can register another admin.",
  });

  const registerWithRealtorAuthorization = await registerUser(
    await authHeaders("realtor@gmail.com", GOOD_PASSWORD_2),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      role: "admin",
    },
  );
  expect(registerWithRealtorAuthorization).toMatchObject({
    status: "error",
    message: "Only an admin can register another admin.",
  });

  const registerWithClientAuthorization = await registerUser(
    await authHeaders("client@gmail.com", GOOD_PASSWORD_3),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      role: "admin",
    },
  );
  expect(registerWithClientAuthorization).toMatchObject({
    status: "error",
    message: "Only an admin can register another admin.",
  });

  const registerWithAdminAuthorization = await registerUser(
    await authHeaders("admin1@gmail.com", GOOD_PASSWORD_1),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      role: "admin",
    },
  );
  expect(registerWithAdminAuthorization).toMatchObject({
    status: "success",
    message: "User successfully registered.",
  });
});

test("admin registration", async () => {
  const registerResponse = await registerUser(
    await authHeaders("admin1@gmail.com", GOOD_PASSWORD_1),
    {
      email: "admin2@gmail.com",
      password: GOOD_PASSWORD_4,
      role: "admin",
    },
  );
  expect(registerResponse).toMatchObject({
    status: "success",
    message: "User successfully registered.",
  });
  const incorrectLoginResponse = await loginUser({
    email: "admin2@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse).toMatchObject({
    status: "error",
    message: "Invalid credentials.",
  });
  const correctLoginResponse = await loginUser({
    email: "admin2@gmail.com",
    password: GOOD_PASSWORD_4,
  });
  expect(correctLoginResponse).toMatchObject({
    status: "success",
    role: "admin",
  });
  if (correctLoginResponse.status !== "success") {
    throw new Error();
  }
  expect(correctLoginResponse.jwtToken.length).toBeGreaterThan(5);
});
