import { IMessage } from "../../dataTypes/messages";
import {
  ClientToServerEvents,
  SocketServerType,
  SocketType,
} from "../../dataTypes/socket-io-types";
import addNewMessage from "../../db/messages/addNewMessage";
import getMessages from "../../db/messages/getMessages";

interface IDirectMessage {
  msg: string;
  from: number;
  to: number;
}

export const message = (io: SocketServerType, socket: SocketType) => {
  const directMessage: ClientToServerEvents["message:direct"] = (
    msgParams: IDirectMessage
  ) => {
    const { msg, from, to } = msgParams;
    const msgObj: IMessage = {
      content: msg,
      created: Date.now(),
      from,
      to,
    };
    addNewMessage(msgObj);
    const targetUser = Array.from(io.of("/").sockets.values()).find(
      (i) => i.userID === to
    );
    if (targetUser && targetUser.connected)
      targetUser.emit("message:direct", { msg, from, to });
  };

  const getAllMessages: ClientToServerEvents["message:getAll"] = async ({
    from,
    to,
  }) => {
    const messages = await getMessages({ from, to });
    socket.emit("message:getAll", messages);
  };

  socket.on("message:direct", directMessage);
  socket.on("message:getAll", getAllMessages);
};
