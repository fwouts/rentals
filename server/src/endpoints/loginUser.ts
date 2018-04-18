import { passwordValid } from "@/auth/salting";
import { createSessionToken } from "@/auth/token";
import { LoginUser_Response, LoginUserRequest } from "../api/types";
import { connection } from "../db/connections";
import { User } from "../db/entities/user";

export async function loginUser(
  request: LoginUserRequest,
): Promise<LoginUser_Response> {
  // Trim the email in case the user's keyboard added an extra space (on mobile).
  request.email = request.email.trim();
  const potentialUser = await connection.manager.findOne(User, {
    email: request.email,
  });
  if (!potentialUser) {
    return {
      kind: "failure",
      data: "Invalid credentials.",
    };
  }
  if (!passwordValid(request.password, potentialUser)) {
    return {
      kind: "failure",
      data: "Invalid credentials.",
    };
  }
  const confirmedUser = potentialUser;
  return {
    kind: "success",
    data: {
      authToken: await createSessionToken(confirmedUser),
      role: confirmedUser.role,
      userId: confirmedUser.userId,
      name: confirmedUser.name,
    },
  };
}
