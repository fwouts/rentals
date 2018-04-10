import { authenticate, safeToken } from "@/auth/jwt";
import { AuthRequired, LoginUserResponse } from "../api";

export async function checkAuth(
  headers: AuthRequired,
): Promise<LoginUserResponse> {
  try {
    const currentUser = await authenticate(headers.Authorization);
    return {
      status: "success",
      authToken: safeToken({
        userId: currentUser.userId,
      }),
      role: currentUser.role,
      userId: currentUser.userId,
    };
  } catch (e) {
    return {
      status: "error",
      message: "Invalid credentials.",
    };
  }
}
