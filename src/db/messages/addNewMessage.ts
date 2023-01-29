import knex from "../connect";
import { IMessage } from "../../dataTypes/messages";

export default async (msg: IMessage) => {
  console.log(msg);

  try {
    await knex("messages").insert(msg);
  } catch (error) {
    console.log(error);
  }
};
