import { Server, Socket } from "socket.io";
import { IConversation, IMessageClient } from "./messages";

declare module "socket.io" {
  interface Socket {
    username: string;
    userID: number;
  }
}

export interface ServerToClientEvents {
  "message:direct": (msgData: {
    msg: string;
    from: number;
    to: number;
  }) => void;
  users: (users: { userID: number; username: string }[]) => void;
  "message:getAll": (messages: IMessageClient[]) => void;
  "message:getAllConvs": (convs: IConversation[]) => void;
}

export interface ClientToServerEvents {
  "message:direct": (msgParams: {
    msg: string;
    from: number;
    to: number;
  }) => void;
  "message:getAll": (users: { from: number; to: number }) => void;
  "message:getAllConvs": () => void;
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
