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
    const user = new User(uuid.v4());
    user.email = props.email;
    user.role = props.role;
    const saltedHash = salting.saltedHash(props.password);
    user.salt = saltedHash.salt;
    user.saltedPassword = saltedHash.saltedPassword;
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
}
