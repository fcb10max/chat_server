import { IConversation, IMessageClient } from "../../dataTypes/messages";
import { IUser } from "../../dataTypes/user";
import knex from "../connect";


export default async (id: number) => {
  const conversations: IConversation[] = [];
  const messages = await knex("messages")
    .select<IMessageClient[]>([
      "message_id",
      "from",
      "to",
      "content",
      "created",
    ])
    .where("from", id)
    .orWhere("to", id);
  const otherPeopleIds = messages.reduce((arr: number[], msg) => {
    const userID = id === msg.from ? msg.to : msg.from;
    return arr.indexOf(userID) > -1 ? arr : [...arr, userID];
  }, []);
  const users = await knex<IUser>("users")
    .select(["id", "username"])
    .whereIn("id", otherPeopleIds);

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
  return conversations
};
