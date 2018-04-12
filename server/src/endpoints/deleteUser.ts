import { passwordValid } from "@/auth/salting";
import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { AuthRequired, DeleteUser_Response, DeleteUserRequest } from "../api";

export async function deleteUser(
  headers: AuthRequired,
  deleteUserId: string,
  request: DeleteUserRequest,
): Promise<DeleteUser_Response> {
  let currentUser;
  try {
    currentUser = await authenticate(headers.Authorization);
  } catch (e) {
    return {
      kind: "unauthorized",
      data: "Invalid credentials.",
    };
  }
  const user = await connection.manager.findOne(User, {
    userId: deleteUserId,
  });
  if (!user) {
    return {
      kind: "notfound",
    };
  }
  if (currentUser.userId === deleteUserId) {
    if (!request.password) {
      return {
        kind: "unauthorized",
        data: "For security reasons, a password must be provided.",
      };
    }
    if (!passwordValid(request.password, user)) {
      return {
        kind: "unauthorized",
        data: "Incorrect password.",
      };
    }
    await connection.manager.delete(User, currentUser);
    return {
      kind: "success",
      data: "Your account was deleted successfully. Bye bye.",
    };
  } else {
    if (currentUser.role === "admin") {
      await connection.manager.delete(User, {
        userId: deleteUserId,
      });
      return {
        kind: "success",
        data: "The account was deleted successfully.",
      };
    } else {
      return {
        kind: "unauthorized",
        data: "Users can only delete their own account.",
      };
    }
  }
}
