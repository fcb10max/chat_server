import {
  ClientToServerEvents,
  SocketServerType,
  SocketType,
  INewMessage
} from "../../dataTypes";
import { addNewMessage, getAllConvs, getMessages } from "../../db/messages";

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
    if (!newMsgID || newMsgID < 0) return cb({}, "Could not add message")
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
    }, "");
  };

  const getAllMessages: ClientToServerEvents["message:getAll"] = async (
    { from, to },
    cb
  ) => {
    const messages = await getMessages({ from, to });
    cb(messages.map(({ isArchived, ...others }) => ({ ...others })), "");
  };
  const getConvs: ClientToServerEvents["message:getAllConvs"] = async (cb) => {
    const userID = socket.userID;
    
    const conversations = await getAllConvs(userID);
    cb(conversations, "");
  };

  const updateMsgStatus: ClientToServerEvents["message:updateStatus"] = (message_id, cb) => {
    console.log(message_id);
    cb("")
  }

  socket.on("message:direct", directMessage);
  socket.on("message:getAll", getAllMessages);
  socket.on("message:getAllConvs", getConvs);
  socket.on("message:updateStatus", updateMsgStatus);
};
