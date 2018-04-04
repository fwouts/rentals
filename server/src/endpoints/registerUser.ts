import { decodeJwt } from "@/auth/jwt";
import {
  AuthOptional,
  RegisterUserRequest,
  RegisterUserResponse,
} from "../api";
import { connection } from "../db/connections";
import { User } from "../db/entities/user";

export async function registerUser(
  headers: AuthOptional,
  request: RegisterUserRequest,
): Promise<RegisterUserResponse> {
  let isAdmin = false;
  if (headers.Authorization) {
    const token = decodeJwt(headers.Authorization);
    isAdmin = token.role === "admin";
  }
  if (request.role === "admin" && !isAdmin) {
    return {
      status: "error",
      message: "Only an admin can register another admin.",
    };
  }
  // TODO: Reject too short or obvious passwords.
  const user = User.create({
    email: request.email,
    password: request.password,
    role: request.role,
  });
  try {
    await connection.manager.save(user);
    return {
      status: "success",
      message: "User successfully registered.",
    };
  } catch (e) {
    if (e.constraint === "uk_user_email") {
      return {
        status: "error",
        message: "Email already registered.",
      };
    }
    throw e;
  }
}
