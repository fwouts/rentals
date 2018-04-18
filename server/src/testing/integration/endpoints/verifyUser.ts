import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { VerifyUser_Response, VerifyUserRequest } from "../api/types";

export async function verifyUser(
  request: VerifyUserRequest,
): Promise<VerifyUser_Response> {
  const user = await connection.manager.findOne(User, {
    email: request.email,
  });
  if (user) {
    user.pendingEmail = null;
    user.pendingEmailToken = null;
    await connection.manager.save(user);
  }
  return {
    kind: "success",
  };
}
