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
  const directMessage: ClientToServerEvents["message:direct"] = async (
    msgParams: IDirectMessage,
    cb
  ) => {
    const { msg, from, to } = msgParams;
    const msgObj: INewMessage = {
      content: msg,
      created: Date.now(),
      isArchived: false,
      from,
      to,
    };
    const newMsgID = await addNewMessage(msgObj);
    // if (newMsgID < 0) // TODO: Error adding message
    const targetUser = Array.from(io.of("/").sockets.values()).find(
      (i) => i.userID === to
    );
    if (targetUser && targetUser.connected)
      targetUser.emit("message:direct", {
        content: msgObj.content,
        created: msgObj.created,
        from: msgObj.from,
        to: msgObj.to,
        message_id: newMsgID,
      });
    cb({
      content: msgObj.content,
      created: msgObj.created,
      from: msgObj.from,
      to: msgObj.to,
      message_id: newMsgID,
    });
  };

  const getAllMessages: ClientToServerEvents["message:getAll"] = async (
    { from, to },
    cb
  ) => {
    const messages = await getMessages({ from, to });
    cb(messages.map(({ isArchived, ...others }) => ({ ...others })));
  };
  const getConvs: ClientToServerEvents["message:getAllConvs"] = async (cb) => {
    const userID = socket.userID;
    const conversations = await getAllConvs(userID);
    cb(conversations);
  };

  socket.on("message:direct", directMessage);
  socket.on("message:getAll", getAllMessages);
  socket.on("message:getAllConvs", getConvs);
};
