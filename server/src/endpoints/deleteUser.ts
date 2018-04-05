import { authenticate } from "@/auth/jwt";
import { passwordValid } from "@/auth/salting";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { AuthRequired, DeleteUserRequest, DeleteUserResponse } from "../api";

export async function deleteUser(
  headers: AuthRequired,
  deleteUserId: string,
  request: DeleteUserRequest,
): Promise<DeleteUserResponse> {
  const currentUser = await authenticate(headers.Authorization);
  const user = await connection.manager.findOne(User, {
    userId: deleteUserId,
  });
  if (!user) {
    return {
      status: "error",
      message: "No such user.",
    };
  }
  if (currentUser.userId === deleteUserId) {
    if (!request.password) {
      return {
        status: "error",
        message: "For security reasons, a password must be provided.",
      };
    }
    if (!passwordValid(request.password, user)) {
      return {
        status: "error",
        message: "Incorrect password.",
      };
    }
    await connection.manager.delete(User, currentUser);
    return {
      status: "success",
      message: "Your account was deleted successfully. Bye bye.",
    };
  } else {
    if (currentUser.role === "admin") {
      await connection.manager.delete(User, {
        userId: deleteUserId,
      });
      return {
        status: "success",
        message: "The account was deleted successfully.",
      };
    } else {
      return {
        status: "error",
        message: "Users can only delete their own account.",
      };
    }
  }
}
