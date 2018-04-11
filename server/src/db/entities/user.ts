import { Role } from "@/api";
import * as salting from "@/auth/salting";
import { Session } from "@/db/entities/session";
import owasp from "owasp-password-strength-test";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import uuid from "uuid";

owasp.config({
  minLength: 8,
  minOptionalTestsToPass: 3,
});

@Entity()
export class User {
  public static create(
    props: {
      email: string;
      password: string;
      name: string;
      role: Role;
    },
    options: {
      verified?: boolean;
    } = {},
  ): User {
    const user = new User(uuid.v4());
    user.email = props.email;
    user.name = props.name;
    user.role = props.role;
    user.setPassword(props.password);
    if (!options.verified) {
      user.setPendingEmail(props.email);
    }
    return user;
  }

  @PrimaryColumn("varchar", {
    length: 36,
  })
  public userId!: string;

  @Column("varchar", {
    unique: true,
    length: 254,
  })
  public email!: string;

  // Email address pending verification.
  //
  // This will be set in two cases:
  // - when the user first registered (same as `email`)
  // - when the user updates their email address (different from `email`)
  //
  // Null when the email address has been verified.
  @Column("varchar", {
    length: 254,
    nullable: true,
  })
  public pendingEmail!: string | null;

  // Token sent to the pending email address to verify ownership.
  //
  // Null when the email address has been verified.
  @Column("varchar", {
    length: 36,
    nullable: true,
  })
  public pendingEmailToken!: string | null;

  @Column("varchar", {
    length: 64,
  })
  public name!: string;

  @Column("varchar", {
    length: 36,
  })
  public salt!: string;

  @Column("varchar", {
    length: 128,
  })
  public saltedPassword!: string;

  // TODO: Switch to enum once TypeORM supports it.
  // See https://github.com/typeorm/typeorm/issues/1045.
  // @Column("enum", {
  //   enum: ["client", "realtor", "admin"],
  // })
  @Column("varchar", {
    length: 7,
  })
  public role!: Role;

  @OneToMany((type) => Session, (session) => session.user)
  public sessions!: Session[];

  public constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
  }

  public setPendingEmail(email: string) {
    this.pendingEmail = email;
    this.pendingEmailToken = uuid.v4();
  }

  public setPassword(password: string) {
    const passwordTest = owasp.test(password);
    if (!passwordTest.strong) {
      throw new Error("Password too weak: " + passwordTest.errors[0]);
    }
    const saltedHash = salting.saltedHash(password);
    this.salt = saltedHash.salt;
    this.saltedPassword = saltedHash.saltedPassword;
  }
}
