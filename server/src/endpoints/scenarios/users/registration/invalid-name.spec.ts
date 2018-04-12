import { registerUser } from "@/endpoints/registerUser";
import { useTestingDatabase } from "@/testing/db";
import { GOOD_PASSWORD_1 } from "@/testing/passwords";
import "jest";

useTestingDatabase();

test("empty names cannot be registered", async () => {
  expect(
    await registerUser(
      {},
      {
        email: "test@gmail.com",
        password: GOOD_PASSWORD_1,
        name: "",
        role: "realtor",
      },
    ),
  ).toMatchObject({
    kind: "failure",
    data: "Please fill in a name.",
  });
  expect(
    await registerUser(
      {},
      {
        email: "test@gmail.com",
        password: GOOD_PASSWORD_1,
        name: "   ",
        role: "realtor",
      },
    ),
  ).toMatchObject({
    kind: "failure",
    data: "Please fill in a name.",
  });
});
