import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getUsers from "../../db/users/getUsers";

dotenv.config();

interface JwtPayload {
  user_id: number;
}

export const checkToken =  async (req: Request, res: Response) => {
  const token: string = req.cookies.jwt;

  if (!token) {
    res.status(400).json({ success: false, msg: "Token not found" });
    return;
  }

  try {
    const { user_id } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload;
    const { id, username } = (await getUsers({ id: user_id }))[0];

    res.status(200).json({ success: true, user: { userID: id, username } });
  } catch (error) {
    console.log(error);

    res.status(520).json({
      success: false,
      msg: "Something went wron during token verification",
    });
  }
};
