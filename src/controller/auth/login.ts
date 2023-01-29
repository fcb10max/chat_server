import { Request, Response } from "express";
import getUsers from "../../db/users/getUsers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = (await getUsers({ username }))[0];
  if (!user) {
    res
      .status(400)
      .json({ success: false, msg: "Entered username does not exist" });
    return;
  }

  const isPassCorrect = await bcrypt.compare(password, user.password);
  console.log(isPassCorrect);

  if (!isPassCorrect) {
    res.status(401).json({ success: false, msg: "Invalid password" });
    return;
  }

  const genToken = (id: any) =>
    jwt.sign(id, process.env.JWT_SECRET_KEY!, { expiresIn: "12h" });
  const token = genToken({ user_id: user.id });

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 12,
    httpOnly: true,
  });
  res.status(200).json({ success: true });

  console.log("success");
};
