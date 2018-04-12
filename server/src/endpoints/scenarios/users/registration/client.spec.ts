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
    kind: "success",
    data: "Great! Please check your email inbox now.",
  });
  const incorrectLoginResponse = await loginUser({
    email: "client@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse).toMatchObject({
    kind: "failure",
    data: "Invalid credentials.",
  });
  const correctLoginResponse = await loginUser({
    email: "client@gmail.com",
    password: GOOD_PASSWORD_1,
  });
  if (correctLoginResponse.kind !== "success") {
    throw expect(correctLoginResponse).toMatchObject({
      kind: "success",
      data: {
        role: "client",
      },
    });
  }
  expect(correctLoginResponse.data.authToken.length).toBeGreaterThan(5);
});
