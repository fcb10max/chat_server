import knex from "../connect";
import { INewMessage } from "../../dataTypes/messages";

export const addNewMessage = async (msg: INewMessage) => {
  try {
    const newMsgID = (await knex("messages").insert(msg))[0];
    return newMsgID;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
