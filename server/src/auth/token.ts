import { connection } from "@/db/connections";
import { Session } from "@/db/entities/session";
import { User } from "@/db/entities/user";
import moment from "moment";

export async function authenticate(token: string): Promise<User> {
  const session = await connection.manager.findOne(Session, {
    authToken: token,
  });
  if (!session) {
    throw new Error(`Invalid session token.`);
  }
  if (moment(session.expires).isBefore(moment())) {
    throw new Error(`Session expired.`);
  }
  return session.user;
}

export async function createSessionToken(user: User): Promise<string> {
  const session = Session.create(user, 30 /* days */);
  await connection.manager.save(session);
  return session.authToken;
}
