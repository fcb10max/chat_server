import { IMessage, IMessageWithID } from "../../dataTypes/messages";
import knex from "../connect";

interface IGetAllMessages {
  from: number;
  to: number;
}

const getAllMessages = async ({ from, to }: IGetAllMessages) => {
  return await knex<IMessageWithID>("messages")
    .select("*")
    .where("from", from)
    .orWhere("to", to)
    .orWhere("from", to)
    .orWhere("to", from);
};

export default getAllMessages;
