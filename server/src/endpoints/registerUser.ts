import { authenticate } from "@/auth/token";
import { sendUserRegistrationVerification } from "@/emails/user-registration";
import emailValidator from "email-validator";
import owasp from "owasp-password-strength-test";
import {
  AuthOptional,
  RegisterUser_Response,
  RegisterUserRequest,
} from "../api/types";
import { connection } from "../db/connections";
import { User } from "../db/entities/user";

export async function registerUser(
  headers: AuthOptional,
  request: RegisterUserRequest,
): Promise<RegisterUser_Response> {
  let isAdmin = false;
  if (headers.Authorization) {
    const currentUser = await authenticate(headers.Authorization);
    isAdmin = currentUser.role === "admin";
  }
  if (request.role === "admin" && !isAdmin) {
    return {
      kind: "unauthorized",
      data: "Only an admin can register another admin.",
    };
  }
  // Trim the inputs in case the user's keyboard added an extra space (on mobile).
  request.email = request.email.trim();
  request.name = request.name.trim();
  if (!request.email) {
    return {
      kind: "failure",
      data: "Please fill in an email address.",
    };
  }
  if (!request.name) {
    return {
      kind: "failure",
      data: "Please fill in a name.",
    };
  }
  if (!emailValidator.validate(request.email)) {
    return {
      kind: "failure",
      data: "Invalid email address format.",
    };
  }
  const passwordTest = owasp.test(request.password);
  if (!passwordTest.strong) {
    return {
      kind: "failure",
      data: "Password too weak: " + passwordTest.errors[0],
    };
  }
  const user = User.create({
    email: request.email,
    password: request.password,
    name: request.name,
    role: request.role,
  });
  if (isAdmin) {
    // Users created by admins don't need verification.
    user.pendingEmail = null;
    user.pendingEmailToken = null;
  }
  try {
    await connection.manager.save(user);
    await sendUserRegistrationVerification(user);
    return {
      kind: "success",
      data: isAdmin
        ? "User successfully registered."
        : "Great! Please check your email inbox now.",
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
