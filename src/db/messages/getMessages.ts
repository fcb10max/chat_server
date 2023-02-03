import { IMessage } from "../../dataTypes/messages";
import knex from "../connect";

interface IGetAllMessages {
  from: number;
  to: number;
}

export const getMessages = async ({ from, to }: IGetAllMessages) => {
  return await knex<IMessage>("messages")
    .select("*")
    .where("from", from ?? "")
    .andWhere("to", to ?? "")
    .orWhere("from", to ?? "")
    .andWhere("to", from ?? "");
};