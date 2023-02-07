import knex from "../connect";

interface IChangeMsgStatus {
  message_ids: number[];
}

interface result {
  success: boolean;
  error: any;
  from: number;
}

export const changeMsgStatus = async ({
  message_ids,
}: IChangeMsgStatus): Promise<result> => {
  const result: result = { success: false, error: "", from: -1 };
  try {
    const { from } = (
      await knex("messages")
        .whereIn("message_id", message_ids)
        .update({ isRead: true })
        .returning("from")
    )[0];
    result.success = true;
    result.from = from;
  } catch (error) {
    result.success = false;
    result.error = error;
  }
  return result;
};
