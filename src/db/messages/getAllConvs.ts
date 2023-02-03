import { IConversation, IMessageClient } from "../../dataTypes/messages";
import { IUser } from "../../dataTypes/user";
import knex from "../connect";

export const getAllConvs = async (self: number) => {
  const conversations: IConversation[] = [];
  
  const messages = await knex("messages")
    .select<IMessageClient[]>([
      "message_id",
      "from",
      "to",
      "content",
      "created",
    ])
    .where("from", self ?? "")
    .orWhere("to", self ?? "");
  const notSelfIds = messages.reduce((arr: number[], msg) => {
    const notSelfID = self === msg.from ? msg.to : msg.from;
    return arr.indexOf(notSelfID) > -1 ? arr : [...arr, notSelfID];
  }, []);
  const users = await knex<Pick<IUser, "id" | "username">>("users")
    .select(["id", "username"])
    .whereIn("id", notSelfIds);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const messagesWithUser = messages.filter(
      ({ from, to }) => from === user.id || to === user.id
    );
    const lastMessage = messagesWithUser.reduce((prevMsg, currMsg) => {
      const prevMsgTime = prevMsg.created;
      const currMsgTime = currMsg.created;
      return prevMsgTime > currMsgTime ? prevMsg : currMsg;
    });
    conversations.push({ lastMsg: lastMessage, user: user });
  }
  return conversations;
};
