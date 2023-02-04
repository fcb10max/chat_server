import knex from "../connect";

interface IChangeMsgStatus {
  message_id: number;
}

export const changeMsgStatus = async ({ message_id }: IChangeMsgStatus) => {
  console.log(message_id);
};
