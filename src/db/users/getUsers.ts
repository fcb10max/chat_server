import { IUser } from "../../dataTypes/user";
import knex from "../connect";

export default async ({
  id,
  email,
  username,
}: Partial<Pick<IUser, "email" | "id" | "username">>) => {
  if (!id && !email && !username)
    return await knex("users").select<IUser[]>("*").limit(5);
  return await knex("users")
    .select<IUser[]>("*")
    .whereLike("id", `%${id}%` ?? "")
    .orWhereLike("email", `%${email}%` ?? "")
    .orWhereLike("username", `%${username}%` ?? "");
};
