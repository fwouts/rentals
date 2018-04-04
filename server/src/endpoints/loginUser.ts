import { encodeJwt } from "@/auth/jwt";
import { passwordValid } from "@/auth/salting";
import { LoginUserRequest, LoginUserResponse } from "../api";
import { connection } from "../db/connections";
import { User } from "../db/entities/user";

export async function loginUser(
  request: LoginUserRequest,
): Promise<LoginUserResponse> {
  const potentialUser = await connection.manager.findOne(User, {
    email: request.email,
  });
  if (!potentialUser) {
    return {
      status: "error",
      message: "Invalid credentials.",
    };
  }
  if (!passwordValid(request.password, potentialUser)) {
    return {
      status: "error",
      message: "Invalid credentials.",
    };
  }
  const confirmedUser = potentialUser;
  return {
    status: "success",
    jwtToken: encodeJwt({
      userId: confirmedUser.userId,
      role: confirmedUser.role,
    }),
    role: confirmedUser.role,
    userId: confirmedUser.userId,
  };
}
