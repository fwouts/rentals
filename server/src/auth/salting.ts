import crypto from "crypto";
import uuid from "uuid";

export interface Salted {
  salt: string;
  saltedPassword: string;
}

export function saltedHash(password: string, salt?: string): Salted {
  if (!salt) {
    salt = uuid.v4();
  }
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const saltedPassword = hash.digest("hex");
  return {
    salt,
    saltedPassword,
  };
}
