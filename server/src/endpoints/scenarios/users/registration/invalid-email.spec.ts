import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

useTestingDatabase();

test("invalid emails cannot be registered", async () => {
  const response = await registerUser(
    {},
    {
      email: "hello-gmail.com",
      password: GOOD_PASSWORD_1,
      name: "Realtor",
      role: "realtor",
    },
  );
  expect(response).toMatchObject({
    status: "error",
    message: "Invalid email address format.",
  });
});
