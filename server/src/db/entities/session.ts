import { User } from "@/db/entities/user";
import moment from "moment";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import uuid from "uuid";

@Entity()
export class Session {
  public static create(user: User, durationDays: number): Session {
    const session = new Session();
    session.authToken = uuid.v4();
    session.user = user;
    session.expires = moment()
      .add(durationDays, "days")
      .toDate();
    return session;
  }

  @PrimaryGeneratedColumn() public sessionId!: string;

  @Column("varchar", {
    length: 36,
  })
  public authToken!: string;

  @ManyToOne((type) => User, {
    eager: true,
    onDelete: "CASCADE",
  })
  public user!: User;

  @Column("timestamp without time zone") public expires!: Date;
}
