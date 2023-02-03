import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../../dataTypes/user";
import addUser from "../../db/users/addUser";
import checkNewUserValidity from "../../helpers/checkNewUserValidity";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  const user: Pick<IUser, "email" | "username" | "password"> = req.body;
  const { isValid, errMsg } = await checkNewUserValidity({
    email: user.email,
    username: user.username,
  });

  if (!isValid) {
    res.status(406).json({ success: false, msg: errMsg });
    return;
  }

  const result = await addUser(user);
  if (result.error) {
    res.status(520).json({ success: false, errMsg: result.errMsg });
    return;
  }

  const genToken = (id: number) =>
    jwt.sign({ user_id: id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "12h",
    });
  const token = genToken(result.userID);

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 12,
    httpOnly: true,
  });
  res.status(200).json({ success: true });
};
