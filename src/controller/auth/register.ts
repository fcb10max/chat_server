import { Request, Response } from "express";
import { IUser } from "../../dataTypes/user";
import addUser from "../../db/addUser";
import checkNewUserValidity from "../../helpers/checkNewUserValidity";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req: Request, res: Response) => {
  const user: IUser = req.body;
  const { isValid, errMsg } = await checkNewUserValidity(user);
  console.log("isvalid: ", isValid, "errMsg: ", errMsg);
  
  if (!isValid) {
    res.status(406).json({ success: false, msg: errMsg });
    return;
  }

  const result = await addUser(user);
  if (result.error) {
    res.status(520).json({ success: false, errMsg: result.errMsg });
    return;
  }

  const genToken = (id: any) =>
    jwt.sign(id, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
  const token = genToken({ user_id: result.id });

  res.cookie("jwt", token, {
    maxAge: 1000 * 60 * 60 * 3,
    httpOnly: true,
  });
  res.status(200).json({ success: true });
};
