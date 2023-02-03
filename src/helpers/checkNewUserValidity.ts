import { IUser } from "../dataTypes/user";
import getUsers from "../db/users/getUsers";

export default async (user: Pick<IUser, "email" | "username">) => {
  const { username, email } = user;
  let isValid = true;
  let errMsg = "";

  const emailPattern =
    /^[^0-9][a-z0-9._-]+\@{1}[^0-9]{1}[a-z-0-9]+(?:\.[a-zA-Z]+)*$/;
  const usernamePattern = /^[A-Za-z0-9-_.]*$/;

  if (!emailPattern.test(email)) {
    errMsg = "Invalid email address";
  } else if (!usernamePattern.test(username)) {
    errMsg =
      "On username allowed only alpha-numeric, dot, hyphen and underscore";
  } else {
    try {
      const user = (await getUsers({ username, email }))[0];
      if (user) {
        errMsg = "Entered username or email already exists!";
      }
    } catch (error) {
      console.log(error);

      errMsg = "Something went wrong while checking new account";
    }
  }

  if (!!errMsg) isValid = false;

  return { isValid, errMsg };
};
