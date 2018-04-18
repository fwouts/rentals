import { FRONTEND_HOST } from "@/config";
import { User } from "@/db/entities/user";
import { sendEmail } from "@/emails/sender";
import path from "path";
import pug from "pug";

const HTML = pug.compileFile(path.join(__dirname, "html.pug"));
const SUBJECT = pug.compileFile(path.join(__dirname, "subject.pug"));

export async function sendEmailUpdateVerification(user: User) {
  await sendEmail({
    to: user.email,
    subject: SUBJECT({
      user,
    }),
    html: HTML({
      user,
      verifyUrl: `${FRONTEND_HOST}/verify/${user.pendingEmailToken}`,
    }),
  });
}
