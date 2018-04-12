import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

useTestingDatabase();

test("realtor registration", async () => {
  const registerResponse = await registerUser(
    {},
    {
      email: "realtor@gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Realtor",
      role: "realtor",
    },
  );
  expect(registerResponse).toMatchObject({
    kind: "success",
    data: "Great! Please check your email inbox now.",
  });
  const incorrectLoginResponse = await loginUser({
    email: "realtor@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse).toMatchObject({
    kind: "failure",
    data: "Invalid credentials.",
  });
  const correctLoginResponse = await loginUser({
    email: "realtor@gmail.com",
    password: GOOD_PASSWORD_1,
  });
  if (correctLoginResponse.kind !== "success") {
    throw expect(correctLoginResponse).toMatchObject({
      kind: "success",
      data: {
        role: "realtor",
      },
    });
  }
  expect(correctLoginResponse.data.authToken.length).toBeGreaterThan(5);
});
