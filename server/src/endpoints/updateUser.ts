import { passwordValid } from "@/auth/salting";
import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { sendEmailUpdateVerification } from "@/emails/user-email-update";
import emailValidator from "email-validator";
import owasp from "owasp-password-strength-test";
import { AuthRequired, UpdateUserRequest, UpdateUserResponse } from "../api";

export async function updateUser(
  headers: AuthRequired,
  updateUserId: string,
  request: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  const currentUser = await authenticate(headers.Authorization);
  const user = await connection.manager.findOne(User, {
    userId: updateUserId,
  });
  if (!user) {
    return {
      status: "error",
      message: "No such user.",
    };
  }
  if (request.email) {
    if (!emailValidator.validate(request.email)) {
      return {
        status: "error",
        message: "Invalid email address format.",
      };
    }
    const existingUser = await connection.manager.findOne(User, {
      email: request.email,
    });
    if (existingUser) {
      return {
        status: "error",
        message: "This email address is already registered.",
      };
    }
  }
  if (request.newPassword) {
    const passwordTest = owasp.test(request.newPassword);
    if (!passwordTest.strong) {
      return {
        status: "error",
        message: "Password too weak: " + passwordTest.errors[0],
      };
    }
  }
  if (currentUser.userId === updateUserId) {
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
    if (request.email) {
      user.setPendingEmail(request.email);
    }
    if (request.name) {
      user.name = request.name;
    }
    if (request.newPassword) {
      user.setPassword(request.newPassword);
    }
    await connection.manager.save(user);
    if (request.email) {
      await sendEmailUpdateVerification(user);
      return {
        status: "success",
        message: "Please check your email to confirm your new email address.",
      };
    } else {
      return {
        status: "success",
        message: "Your account was updated successfully.",
      };
    }
  } else {
    if (currentUser.role === "admin") {
      if (request.email) {
        user.email = request.email;
      }
      if (request.name) {
        user.name = request.name;
      }
      if (request.newPassword) {
        user.setPassword(request.newPassword);
      }
      await connection.manager.save(user);
      return {
        status: "success",
        message: "The account was updated successfully.",
      };
    } else {
      return {
        status: "error",
        message: "Users can only update their own account.",
      };
    }
  }
}
