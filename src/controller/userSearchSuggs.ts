import { Request, Response } from "express";
import getUsers from "../db/users/getUsers";

export default async (req: Request, res: Response) => {
  const { username } = req.body;

  const usersArr = await getUsers({ username });
  const users = usersArr.map((user) => ({
    username: user.username,
    userID: user.id,
  }));
  res.status(200).json({ success: true, users });
};
