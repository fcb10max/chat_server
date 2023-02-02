import knex from "../connect";
import { INewMessage } from "../../dataTypes/messages";

export default async (msg: INewMessage) => {

  try {
    await knex("messages").insert(msg);
  } catch (error) {
    console.log(error);
  }
};
