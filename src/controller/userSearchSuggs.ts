import { Request, Response } from "express";
import getUsers from "../db/users/getUsers";

export default async (req: Request, res: Response) => {
  const { username } = req.body;
  console.log(username);

  // const usersArr = await getUsers({});
  // const users = usersArr.map((user) => ({
  //   username: user.username,
  //   id: user.id,
  // }));
  const usersArr = await getUsers({ username: "admin2" });
  const users = usersArr.map((user) => ({
    username: user.username,
    id: user.id,
  }));
  res.status(200).json({ success: true, users });
};
