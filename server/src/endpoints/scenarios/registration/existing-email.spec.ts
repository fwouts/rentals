import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { setUpJwtForTesting } from "@/testing/jwt";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

setUpJwtForTesting();
useTestingDatabase();

test("email cannot be reused", async () => {
  const registerFirstAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: GOOD_PASSWORD_1,
      role: "realtor",
    },
  );
  expect(registerFirstAccountResponse).toMatchObject({
    status: "success",
    message: "User successfully registered.",
  });
  const registerSecondAccountResponse = await registerUser(
    {},
    {
      email: "hello@gmail.com",
      password: GOOD_PASSWORD_1,
      role: "client",
    },
  );
  expect(registerSecondAccountResponse).toMatchObject({
    status: "error",
    message: "Email already registered.",
  });
});
