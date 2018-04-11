import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { AuthRequired, UserDetails } from "../api";

export async function getUser(
  headers: AuthRequired,
  userId: string,
): Promise<UserDetails> {
  const currentUser = await authenticate(headers.Authorization);
  if (currentUser.role !== "admin") {
    throw new Error("Only admins can get users.");
  }
  const user = await connection.manager.findOneById(User, userId);
  if (!user) {
    throw new Error("No such user.");
  }
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
