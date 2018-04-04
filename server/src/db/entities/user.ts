import { Role } from "@/api";
import * as salting from "@/auth/salting";
import { Column, Entity, PrimaryColumn } from "typeorm";
import uuid from "uuid";

@Entity()
export class User {
  public static create(props: {
    email: string;
    password: string;
    role: Role;
  }): User {
    const user = new User();
    user.userId = uuid.v4();
    user.email = props.email;
    user.role = props.role;
    const saltedHash = salting.saltedHash(props.password);
    user.salt = saltedHash.salt;
    user.saltedPassword = saltedHash.saltedPassword;
    return user;
  }

  @PrimaryColumn("text") public userId!: string;

  @Column("text", { unique: true })
  public email!: string;

  @Column("text") public salt!: string;

  @Column("text") public saltedPassword!: string;

  @Column("text") public role!: Role;
}
