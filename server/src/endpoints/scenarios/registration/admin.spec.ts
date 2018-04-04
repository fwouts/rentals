import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

beforeEach(async () => {
  const admin = User.create({
    email: "admin1@gmail.com",
    password: "adminpass",
    role: "admin",
  });
  const realtor = User.create({
    email: "realtor@gmail.com",
    password: "realtorpass",
    role: "realtor",
  });
  const client = User.create({
    email: "client@gmail.com",
    password: "clientpass",
    role: "client",
  });
  await connection.manager.save([admin, realtor, client]);
});

test("only an admin can register another admin", async () => {
  const registerWithoutAuthorization = await registerUser(
    {},
    {
      email: "admin2@gmail.com",
      password: "pass",
      role: "admin",
    },
  );
  expect(registerWithoutAuthorization).toMatchObject({
    status: "error",
    message: "Only an admin can register another admin.",
  });

  const registerWithRealtorAuthorization = await registerUser(
    {
      Authorization: await token("realtor@gmail.com", "realtorpass"),
    },
    {
      email: "admin2@gmail.com",
      password: "pass",
      role: "admin",
    },
  );
  expect(registerWithRealtorAuthorization).toMatchObject({
    status: "error",
    message: "Only an admin can register another admin.",
  });

  const registerWithClientAuthorization = await registerUser(
    {
      Authorization: await token("client@gmail.com", "clientpass"),
    },
    {
      email: "admin2@gmail.com",
      password: "pass",
      role: "admin",
    },
  );
  expect(registerWithClientAuthorization).toMatchObject({
    status: "error",
    message: "Only an admin can register another admin.",
  });

  const registerWithAdminAuthorization = await registerUser(
    {
      Authorization: await token("admin1@gmail.com", "adminpass"),
    },
    {
      email: "admin2@gmail.com",
      password: "pass",
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
    {
      Authorization: await token("admin1@gmail.com", "adminpass"),
    },
    {
      email: "admin2@gmail.com",
      password: "pass",
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
    password: "pass",
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

async function token(email: string, password: string): Promise<string> {
  const loginResponse = await loginUser({
    email,
    password,
  });
  if (loginResponse.status !== "success") {
    throw new Error();
  }
  return loginResponse.jwtToken;
}
