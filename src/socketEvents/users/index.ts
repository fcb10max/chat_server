import {
  ClientToServerEvents,
  SocketServerType,
  SocketType,
} from "../../dataTypes/socket-io-types";
import getUsers from "../../db/users/getUsers";

export const users = (io: SocketServerType, socket: SocketType) => {
  const userSearchSuggestions: ClientToServerEvents["users:getSuggestions"] = async (
    { username },
    cb
  ) => {
    const usersArr = await getUsers({ username });
    const users = usersArr.map((user) => ({
      username: user.username,
      id: user.id,
    }));
    cb(users, "")
  };

  socket.on("users:getSuggestions", userSearchSuggestions);
};
