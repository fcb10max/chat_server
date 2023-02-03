import { Server, Socket } from "socket.io";
import { IConversation, IMessageClient } from "./messages";
import { IUser } from "./user";

declare module "socket.io" {
  interface Socket {
    username: string;
    userID: number;
  }
}

export interface ServerToClientEvents {
  "message:direct": (msgData: IMessageClient) => void;
}

export interface ClientToServerEvents {
  "message:direct": (
    msgData: {
      msg: string;
      from: number;
      to: number;
    },
    callback: (msg: IMessageClient | {}, error: string) => void
  ) => void;
  "message:getAll": (
    users: { from: number; to: number },
    callback: (res: IMessageClient[] | {}, error: string) => void
  ) => void;
  "message:getAllConvs": (
    callback: (conversations: IConversation[] | {}, error: string) => void
  ) => void;
  "users:getSuggestions": (
    searchData: { username: string },
    callback: (
      suggs: Omit<IUser, "password" | "email">[] | {},
      error: string
    ) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  id: number;
  username: string;
}

export type SocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type SocketServerType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
