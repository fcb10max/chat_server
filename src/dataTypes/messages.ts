export interface IMessage {
  from: number,
  to: number,
  created: number,
  content: string,
}

export interface IMessageWithID extends IMessage {
  message_id: number
}
