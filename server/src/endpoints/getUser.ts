import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { AuthRequired, GetUser_Response } from "../api/types";

export async function getUser(
  headers: AuthRequired,
  userId: string,
): Promise<GetUser_Response> {
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch (e) {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  if (currentUser.role !== "admin") {
    return {
      kind: "unauthorized",
      data: "Only admins can get users.",
    };
  }
  const user = await connection.manager.findOneById(User, userId);
  if (!user) {
    return {
      kind: "notfound",
    };
  }
  return {
    kind: "success",
    data: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
