import { createSessionToken } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { VerifyEmailAddress_Response, VerifyEmailRequest } from "../api";

export async function verifyEmailAddress(
  request: VerifyEmailRequest,
): Promise<VerifyEmailAddress_Response> {
  const user = await connection.manager.findOne(User, {
    pendingEmailToken: request.token,
  });
  if (!user) {
    return {
      kind: "failure",
      data: "We couldn't find a match in our database. Try signing in?",
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
      kind: "success",
      data: {
        authToken: await createSessionToken(user),
        role: user.role,
        userId: user.userId,
        name: user.name,
      },
    };
  } catch (e) {
    if (e.message.indexOf("duplicate key value") !== -1) {
      return {
        kind: "failure",
        data: "This email address is already registered.",
      };
    }
    throw e;
  }
}
