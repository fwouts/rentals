import { authenticate } from "@/auth/token";
import { AuthRequired, LoginUserResponse } from "../api";

export async function checkAuth(
  headers: AuthRequired,
): Promise<LoginUserResponse> {
  try {
    const authToken = headers.Authorization;
    const currentUser = await authenticate(authToken);
    return {
      status: "success",
      authToken,
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
