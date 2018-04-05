import { connection } from "@/db/connections";
import { User } from "@/db/entities/user";
import jwt from "jsonwebtoken";

export async function authenticate(token: string): Promise<User> {
  const payload = jwt.verify(token, process.env.JWT_SECRET || "");
  if (typeof payload === "string") {
    throw new Error(`Unexpected string payload: ${payload}.`);
  } else {
    const { userId }: any = payload;
    if (typeof userId !== "string") {
      throw new Error(`Invalid JWT payload.`);
    }
    const user = await connection.manager.findOneById(User, userId);
    if (!user) {
      throw new Error(`User no longer exists.`);
    }
    return user;
  }
}

export function safeToken(payload: { userId: string }) {
  return jwt.sign(
    payload,
    // JWT will fail if we give it an empty string. That's a good thing.
    process.env.JWT_SECRET || "",
  );
}
