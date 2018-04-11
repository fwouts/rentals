import { createSessionToken } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { VerifyEmailRequest, VerifyEmailResponse } from "../api";

export async function verifyEmailAddress(
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  const user = await connection.manager.findOne(User, {
    pendingEmailToken: request.token,
  });
  if (!user) {
    return {
      status: "error",
      message: "We couldn't find a match in our database. Try signing in?",
    };
  }
  if (!user.pendingEmail) {
    // This should never happen.
    throw new Error();
  }
  user.email = user.pendingEmail;
  user.pendingEmail = null;
  user.pendingEmailToken = null;
  try {
    await connection.manager.save(user);
    return {
      status: "success",
      authToken: await createSessionToken(user),
      role: user.role,
      userId: user.userId,
    };
  } catch (e) {
    if (e.message.indexOf("duplicate key value") !== -1) {
      return {
        status: "error",
        message: "This email address is already registered.",
      };
    }
    throw e;
  }
}
