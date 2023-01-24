import { IUser } from "../dataTypes/user";
import knex from "./connect";

interface IGetUser {
  id?: number;
  email?: string;
  username?: string;
}

export default async ({ id, email, username }: IGetUser) => {
  const getUsers = async (): Promise<IUser[]> => {
    return await knex("users")
      .select("*")
      .where("id", id ?? "")
      .orWhere("email", email ?? "")
      .orWhere("username", username ?? "");
  };
  return await getUsers();
};
