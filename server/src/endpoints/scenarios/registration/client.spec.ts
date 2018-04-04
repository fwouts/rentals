import { loginUser } from "@/endpoints/loginUser";
import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

test("client registration", async () => {
  const registerResponse = await registerUser(
    {},
    {
      email: "client@gmail.com",
      password: "pass",
      role: "client",
    },
  );
  expect(registerResponse.status).toBe("success");
  expect(registerResponse.message).toBe("User successfully registered.");
  const incorrectLoginResponse = await loginUser({
    email: "client@gmail.com",
    password: "wrong password",
  });
  expect(incorrectLoginResponse.status).toBe("error");
  const correctLoginResponse = await loginUser({
    email: "client@gmail.com",
    password: "pass",
  });
  if (correctLoginResponse.status !== "success") {
    throw expect(correctLoginResponse.status).toBe("success");
  }
  expect(correctLoginResponse.role).toBe("client");
  expect(correctLoginResponse.jwtToken.length).toBeGreaterThan(5);
});
