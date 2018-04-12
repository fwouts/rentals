import { authenticate } from "@/auth/token";
import { AuthRequired, CheckAuth_Response } from "../api";

export async function checkAuth(
  headers: AuthRequired,
): Promise<CheckAuth_Response> {
  try {
    const authToken = headers.Authorization;
    const currentUser = await authenticate(authToken);
    return {
      kind: "success",
      data: {
        authToken,
        role: currentUser.role,
        userId: currentUser.userId,
      },
    };
  } catch (e) {
    return {
      kind: "failure",
      data: "Invalid credentials.",
    };
  }
}
