import { IUser } from "../../dataTypes/user";
import knex from "../connect";

interface IGetUser {
  id?: number;
  email?: string;
  username?: string;
}

export default async ({ id, email, username }: IGetUser) => {
  const getUsers = async (): Promise<IUser[]> => {
    if (!id && !email && !username)
      return await knex("users").select("*").limit(5);
    return await knex("users")
      .select("*")
      .whereLike("id", `%${id}%` ?? "")
      .orWhereLike("email", `%${email}%` ?? "")
      .orWhereLike("username", `%${username}%` ?? "");
  };
  const users = await getUsers();
  return users;
};
