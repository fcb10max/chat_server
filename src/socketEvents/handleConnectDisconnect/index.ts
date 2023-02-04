import { SocketServerType, SocketType } from "../../dataTypes";
import { getAllConvs } from "../../db/messages";

export const handleConnectDisconnect = async (
  io: SocketServerType,
  socket: SocketType
) => {
  const { userID } = socket;
  const talksWith = (await getAllConvs(userID)).map((i) => i.user.id);
  io.sockets.sockets.forEach((i) => {
    if (i.userID === userID || talksWith.indexOf(i.userID) === -1) return;
    i.emit("newOnlineUser", socket.userID);
    socket.emit("newOnlineUser", i.userID);
  });

  socket.on("disconnect", () => {
    io.sockets.sockets.forEach((i) => {
      if (i.userID === userID || talksWith.indexOf(i.userID) === -1) return;
      i.emit("newOfflineUser", socket.userID);
    });
  });
};
