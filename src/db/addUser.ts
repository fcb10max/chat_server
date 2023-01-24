import { User } from "../dataTypes/user";
import db from "./connect";
import bcrypt from "bcrypt";
import { SocketClientType } from "../dataTypes/socket-io-types";

export default async (user: User, socket: SocketClientType) => {
  const { username, email, password } = user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const sql = `INSERT INTO users (username, email, password) VALUES ("${username}", "${email}", "${hashedPassword}")`;
  db.run(sql, function (err) {
    if (err) {
      if (err.message.indexOf("UNIQUE constraint failed") > 0)
        socket.emit("authError", "Entered email or username already exists");
      else socket.emit("authError", err.message);
      return;
    }
    console.log("user add success: ", this);
  });
  return user;
};
