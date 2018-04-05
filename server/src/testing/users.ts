import { AuthRequired } from "@/api";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { loginUser } from "@/endpoints/loginUser";

export const CLIENT_ANNA = "anna@gmail.com";
export const ANNA_PASSWORD = "N)u8E]U?";

export const CLIENT_BRIAN = "brian@gmail.com";
export const BRIAN_PASSWORD = ")@LC;s7m";

export const REALTOR_JOHN = "john@realestate.com";
export const JOHN_PASSWORD = "+3Z[CqS+";

export const REALTOR_HELENA = "helena@realestate.com";
export const HELENA_PASSWORD = 'Da$4/8A"';

export const ADMIN_FRANK = "frank@rentals.com";
export const FRANK_PASSWORD = "3@4NUx`&";

export const ADMIN_GEORGE = "george@rentals.com";
export const GEORGE_PASSWORD = "9tLS<s/X";

export async function createTestUsers() {
  await connection.manager.save([
    User.create({
      email: CLIENT_ANNA,
      password: ANNA_PASSWORD,
      name: "Anna",
      role: "client",
    }),
    User.create({
      email: CLIENT_BRIAN,
      password: BRIAN_PASSWORD,
      name: "Brian",
      role: "client",
    }),
    User.create({
      email: REALTOR_JOHN,
      password: JOHN_PASSWORD,
      name: "John",
      role: "realtor",
    }),
    User.create({
      email: REALTOR_HELENA,
      password: HELENA_PASSWORD,
      name: "Helena",
      role: "realtor",
    }),
    User.create({
      email: ADMIN_FRANK,
      password: FRANK_PASSWORD,
      name: "Frank",
      role: "admin",
    }),
    User.create({
      email: ADMIN_GEORGE,
      password: GEORGE_PASSWORD,
      name: "George",
      role: "admin",
    }),
  ]);
}

export async function findUser(email: string): Promise<User> {
  const user = await connection.manager.findOne(User, { email });
  if (!user) {
    throw new Error(`No user found.`);
  }
  return user;
}

export async function authHeaders(
  email: string,
  password: string,
): Promise<AuthRequired> {
  const loginResponse = await loginUser({
    email,
    password,
  });
  expect(loginResponse).toMatchObject({
    status: "success",
  });
  if (loginResponse.status !== "success") {
    throw new Error();
  }
  return {
    Authorization: loginResponse.jwtToken,
  };
}
