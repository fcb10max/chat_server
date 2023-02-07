import {
  ClientToServerEvents,
  SocketServerType,
  SocketType,
  INewMessage,
} from "../../dataTypes";
import { addNewMessage, getAllConvs, getMessages } from "../../db/messages";
import { changeMsgStatus } from "../../db/messages/changeMsgStatus";

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
      isRead: false,
    };
    const newMsgID = await addNewMessage(msgObj);
    if (!newMsgID || newMsgID < 0) return cb({}, "Could not add message");
    const targetUser = Array.from(io.of("/").sockets.values()).find(
      (i) => i.userID === to
    );
    const msgToOthers = (() => {
      const { isArchived, ...others } = msgObj;
      return { ...others, message_id: newMsgID };
    })();
    if (targetUser && targetUser.connected)
      targetUser.emit("message:direct", msgToOthers);
    cb(msgToOthers, "");
  };

  const getAllMessages: ClientToServerEvents["message:getAll"] = async (
    { from, to },
    cb
  ) => {
    const messages = await getMessages({ from, to });
    cb(
      messages.map(({ isArchived, ...others }) => ({ ...others })),
      ""
    );
  };
  const getConvs: ClientToServerEvents["message:getAllConvs"] = async (cb) => {
    const userID = socket.userID;

    const conversations = await getAllConvs(userID);
    cb(conversations, "");
  };

  const updateMsgStatus: ClientToServerEvents["message:updateStatus"] = async (
    message_ids,
    cb
  ) => {
    const { error, success, from } = await changeMsgStatus({ message_ids });
    if (success && from !== -1) {
      io.sockets.sockets.forEach((user) => {
        if (user.userID !== from) return;
        user.emit("message:statusUpdate", message_ids);
      });
      cb(true, "");
      return;
    }
    cb(false, error);
  };

  socket.on("message:direct", directMessage);
  socket.on("message:getAll", getAllMessages);
  socket.on("message:getAllConvs", getConvs);
  socket.on("message:updateStatus", updateMsgStatus);
};
