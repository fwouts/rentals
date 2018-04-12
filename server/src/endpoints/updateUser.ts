import { passwordValid } from "@/auth/salting";
import { authenticate } from "@/auth/token";
import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import { sendEmailUpdateVerification } from "@/emails/user-email-update";
import emailValidator from "email-validator";
import owasp from "owasp-password-strength-test";
import { AuthRequired, UpdateUser_Response, UpdateUserRequest } from "../api";

export async function updateUser(
  headers: AuthRequired,
  updateUserId: string,
  request: UpdateUserRequest,
): Promise<UpdateUser_Response> {
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
    userId: updateUserId,
  });
  if (!user) {
    return {
      kind: "notfound",
    };
  }
  // Trim the inputs in case the user's keyboard added an extra space (on mobile).
  if (request.email) {
    request.email = request.email.trim();
  }
  if (request.name) {
    request.name = request.name.trim();
  }
  if (request.email) {
    if (!emailValidator.validate(request.email)) {
      return {
        kind: "failure",
        data: "Invalid email address format.",
      };
    }
    const existingUser = await connection.manager.findOne(User, {
      email: request.email,
    });
    if (existingUser) {
      return {
        kind: "failure",
        data: "This email address is already registered.",
      };
    }
  }
  if (request.newPassword) {
    const passwordTest = owasp.test(request.newPassword);
    if (!passwordTest.strong) {
      return {
        kind: "failure",
        data: "Password too weak: " + passwordTest.errors[0],
      };
    }
  }
  if (currentUser.userId === updateUserId) {
    if (!request.currentPassword) {
      return {
        kind: "unauthorized",
        data: "For security reasons, a password must be provided.",
      };
    }
    if (!passwordValid(request.currentPassword, user)) {
      return {
        kind: "unauthorized",
        data: "Incorrect password.",
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
        kind: "success",
        data: "Please check your email to confirm your new email address.",
      };
    } else {
      return {
        kind: "success",
        data: "Your account was updated successfully.",
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
        kind: "success",
        data: "The account was updated successfully.",
      };
    } else {
      return {
        kind: "unauthorized",
        data: "Users can only update their own account.",
      };
    }
  }
}
