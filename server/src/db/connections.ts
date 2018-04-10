import { Apartment } from "@/db/entities/apartment";
import { Session } from "@/db/entities/session";
import "reflect-metadata";
import { Connection } from "typeorm";
import { User } from "./entities/user";

export let connection: Connection;

export async function initConnection(newConnection: Connection) {
  connection = newConnection;
}

export const ENTITIES = [Apartment, User, Session];
