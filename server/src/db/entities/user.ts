import { Role } from "@/api";
import * as salting from "@/auth/salting";
import owasp from "owasp-password-strength-test";
import { Column, Entity, PrimaryColumn } from "typeorm";
import uuid from "uuid";

owasp.config({
  minLength: 8,
});

@Entity()
export class User {
  public static create(props: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }): User {
    const user = new User(uuid.v4());
    user.email = props.email;
    user.name = props.name;
    user.role = props.role;
    user.setPassword(props.password);
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

  @Column("enum", {
    enum: ["client", "realtor", "admin"],
  })
  public role!: Role;

  public constructor(userId?: string) {
    if (userId) {
      this.userId = userId;
    }
  }

  public setPassword(password: string) {
    const passwordTest = owasp.test(password);
    if (passwordTest.errors.length > 0) {
      throw new Error("Password too weak:\n" + passwordTest.errors.join("\n"));
    }
    const saltedHash = salting.saltedHash(password);
    this.salt = saltedHash.salt;
    this.saltedPassword = saltedHash.saltedPassword;
  }
}
