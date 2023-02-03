import knex from "../connect";
import { IMessage, INewMessage } from "../../dataTypes/messages";

export default async (msg: INewMessage) => {
  try {
    return (await knex("messages").insert(msg))[0];
  } catch (error) {
    console.log(error);
    return -1;
  }
};
