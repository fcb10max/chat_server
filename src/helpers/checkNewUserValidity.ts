import { IUser } from "../dataTypes/user";
// import checkForDuplicate from "../db/checkForDuplicate";

export default async (user: IUser) => {
  const { username, email } = user;
  let isValid = false;
  let errMsg = "";

  const emailPattern =
    /^[^0-9][a-z0-9._-]+\@{1}[^0-9]{1}[a-z-0-9]+(?:\.[a-zA-Z]+)*$/;
  const usernamePattern = /[A-Za-z0-9-_.]+/;

  if (!emailPattern.test(email)) {
    isValid = false;
    errMsg = "Invalid email address";
    return { isValid, errMsg };
  }

  if (!usernamePattern.test(username)) {
    isValid = false;
    errMsg =
      "On username allowed only alpha-numeric, dot, hyphen and underscore";
    return { isValid, errMsg };
  }
  isValid = true;
  errMsg = "";
  return { isValid, errMsg };
};
