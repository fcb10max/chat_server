import knex from "../connect";
import { INewMessage } from "../../dataTypes/messages";

export const addNewMessage = async (msg: INewMessage) => {
  try {
    return (await knex("messages").insert(msg))[0];
  } catch (error) {
    console.log(error);
    return -1;
  }
};
