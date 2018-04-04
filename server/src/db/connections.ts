import "reflect-metadata";
import { Connection } from "typeorm";
import { User } from "./entities/user";

export let connection: Connection;

export async function initConnection(newConnection: Connection) {
  connection = newConnection;
}

export const ENTITIES = [User];
