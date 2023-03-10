import knex from "../connect";
import bcrypt from "bcrypt";
import { IUser } from "../../dataTypes/user";

interface IResult {
  error: boolean;
  userID: any;
  errMsg: string;
}

export default async (user: Pick<IUser, "username" | "email" | "password">) => {
  const { username, email, password } = user;
  const result: IResult = {
    error: false,
    userID: "",
    errMsg: "",
  };

  try {
    const hashPassword = async (password: string) => {
      const salt = await bcrypt.genSalt(10);
      const hP = await bcrypt.hash(password, salt);
      return hP;
    };
    const hashedPassword = await hashPassword(password);
    const ids = await knex<IUser>("users")
      .insert({
        email,
        username,
        password: hashedPassword,
      })
      .returning("id");
    if (!ids.length) {
      result.error = true;
      result.errMsg = `Could not return id of new user: ${username}`;
      return result;
    }
    result.userID = ids[0].id;
  } catch (error) {
    console.log(error);
    result.error = true;
    result.errMsg = "Something went wrong when adding new user to DB";
    return result;
  }
  return result;
};
