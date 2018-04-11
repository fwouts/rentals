import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

useTestingDatabase();

test("client registration", async () => {
  const registerResponse = await registerUser(
    {},
    {
      email: "client@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Client",
      role: "client",
    },
  );
  expect(registerResponse).toMatchObject({
    status: "success",
    message: "Great! Please check your email inbox now.",
  });
  const incorrectLoginResponse = await loginUser({
    email: "client@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse).toMatchObject({
    status: "error",
    message: "Invalid credentials.",
  });
  const correctLoginResponse = await loginUser({
    email: "client@gmail.com",
    password: GOOD_PASSWORD_1,
  });
  expect(correctLoginResponse).toMatchObject({
    status: "success",
    role: "client",
  });
  if (correctLoginResponse.status !== "success") {
    throw new Error();
  }
  expect(correctLoginResponse.authToken.length).toBeGreaterThan(5);
});
