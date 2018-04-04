import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

test("email cannot be reused", async () => {
  const registerFirstAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: "pass",
      role: "realtor",
    },
  );
  expect(registerFirstAccountResponse.status).toBe("success");
  const registerSecondAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: "pass",
      role: "client",
    },
  );
  expect(registerSecondAccountResponse.status).toBe("error");
});
