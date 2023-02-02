import {
  IMessage,
  IMessageClient,
  INewMessage,
} from "../../dataTypes/messages";
import {
  ClientToServerEvents,
  SocketServerType,
  SocketType,
} from "../../dataTypes/socket-io-types";
import addNewMessage from "../../db/messages/addNewMessage";
import getAllConvs from "../../db/messages/getAllConvs";
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
    const msgObj: INewMessage = {
      content: msg,
      created: Date.now(),
      isArchived: false,
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
    socket.emit(
      "message:getAll",
      messages
    );
    
  };
  const getConvs: ClientToServerEvents["message:getAllConvs"] = async () => {
    const userID = socket.userID;
    const conversations = await getAllConvs(userID);
    socket.emit("message:getAllConvs", conversations);
  };

  socket.on("message:direct", directMessage);
  socket.on("message:getAll", getAllMessages);
  socket.on("message:getAllConvs", getConvs);
};
