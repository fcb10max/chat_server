import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getUsers from "../../db/getUsers";

dotenv.config();

interface JwtPayload {
  user_id: number;
}

export default async (req: Request, res: Response) => {
  const token: string = req.cookies.jwt;

  if (!token) {
    res.json({ success: false, errMsg: "Token not found" });
    return;
  }

  const { user_id } = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY!
  ) as JwtPayload;
  const { id, username } = (await getUsers({ id: user_id }))[0];

  res.json({ success: true, user: { id, username } });
};
