import { Role } from "@/api";
import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  role: Role;
}

export function decodeJwt(token: string): TokenPayload {
  const payload = jwt.verify(token, process.env.JWT_SECRET || "");
  if (typeof payload === "string") {
    throw new Error(`Unexpected string payload: ${payload}.`);
  } else {
    // TODO: Cast safely.
    return payload as TokenPayload;
  }
}

export function encodeJwt(payload: TokenPayload) {
  return jwt.sign(
    payload,
    // JWT will fail if we give it an empty string. That's a good thing.
    process.env.JWT_SECRET || "",
  );
}
