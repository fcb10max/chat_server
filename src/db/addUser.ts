import knex from "./connect";
import bcrypt from "bcrypt";
import { INewUser, IUser } from "../dataTypes/user";
import { SocketClientType } from "../dataTypes/socket-io-types";
import getUsers from "./getUsers";

export default async (user: INewUser, socket: SocketClientType) => {
  const { username, email, password } = user;
  const users = await getUsers({ username, email });

  if (!!users.length) {
    return socket.emit("authError", "Entered email or username already exists");
  }

  try {
    const hashPassword = async (password: string) => {
      const salt = await bcrypt.genSalt(10);
      const hP = await bcrypt.hash(password, salt);
      return hP;
    };
    const hashedPassword = await hashPassword(password);
    await knex<IUser>("users").insert({
      email,
      username,
      password: hashedPassword,
    });
  } catch (error) {
    console.log(error);
    socket.emit(
      "authError",
      "something went wrond during account creation process"
    );
  }
};
