import { IUser } from "./user";

export interface IMessage {
  message_id: number;
  from: number;
  to: number;
  created: number;
  content: string;
  isArchived: boolean;
}
export type IMessageClient = Omit<IMessage, "isArchived">;
export type INewMessage = Omit<IMessage, "message_id">;

export interface IConversation {
  user: Pick<IUser, "id" | "username">;
  lastMsg: IMessageClient;
}
