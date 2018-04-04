import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

test("realtor registration", async () => {
  const registerResponse = await registerUser(
    {},
    {
      email: "realtor@gmail.com",
      password: "pass",
      role: "realtor",
    },
  );
  expect(registerResponse.status).toBe("success");
  expect(registerResponse.message).toBe("User successfully registered.");
  const incorrectLoginResponse = await loginUser({
    email: "realtor@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse.status).toBe("error");
  const correctLoginResponse = await loginUser({
    email: "realtor@gmail.com",
    password: "pass",
  });
  if (correctLoginResponse.status !== "success") {
    throw expect(correctLoginResponse.status).toBe("success");
  }
  expect(correctLoginResponse.role).toBe("realtor");
  expect(correctLoginResponse.jwtToken.length).toBeGreaterThan(5);
});
