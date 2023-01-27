import { Request, Response } from "express";
import getUsers from "../db/getUsers";

export default async (req: Request, res: Response) => {
  const usersArr = await getUsers({});
  const users = usersArr.map((user) => ({
    username: user.username,
    id: user.id,
  }));
  res.status(200).json({ success: true, users });
};
