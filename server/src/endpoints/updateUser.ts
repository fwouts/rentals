import { decodeJwt } from "@/auth/jwt";
import { passwordValid } from "@/auth/salting";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import owasp from "owasp-password-strength-test";
import { AuthRequired, UpdateUserRequest, UpdateUserResponse } from "../api";

export async function updateUser(
  headers: AuthRequired,
  updateUserId: string,
  request: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  const { userId, role } = decodeJwt(headers.Authorization);
  const user = await connection.manager.findOne(User, {
    userId: updateUserId,
  });
  if (!user) {
    return {
      status: "error",
      message: "No such user.",
    };
  }
  if (userId === updateUserId) {
    if (!request.currentPassword) {
      return {
        status: "error",
        message: "For security reasons, a password must be provided.",
      };
    }
    if (!passwordValid(request.currentPassword, user)) {
      return {
        status: "error",
        message: "Incorrect password.",
      };
    }
    if (request.newPassword) {
      const passwordTest = owasp.test(request.newPassword);
      if (passwordTest.errors.length > 0) {
        return {
          status: "error",
          message: "Password too weak:\n" + passwordTest.errors.join("\n"),
        };
      }
    }
    updateUserProps(user, request);
    return saveUser(user, "Your account was updated successfully.");
  } else {
    if (role === "admin") {
      updateUserProps(user, request);
      return saveUser(user, "The account was updated successfully.");
    } else {
      return {
        status: "error",
        message: "Users can only update their own account.",
      };
    }
  }
}

function updateUserProps(user: User, request: UpdateUserRequest) {
  if (request.email) {
    user.email = request.email;
  }
  if (request.name) {
    user.name = request.name;
  }
  if (request.newPassword) {
    user.setPassword(request.newPassword);
  }
}

async function saveUser(
  user: User,
  successMessage: string,
): Promise<UpdateUserResponse> {
  try {
    await connection.manager.save(user);
    return {
      status: "success",
      message: successMessage,
    };
  } catch (e) {
    if (e.message.indexOf("duplicate key value") !== -1) {
      return {
        status: "error",
        message: "Email already registered.",
      };
    }
    throw e;
  }
}