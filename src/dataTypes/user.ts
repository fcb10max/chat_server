export interface INewUser {
  username: string;
  password: string;
  email: string;
}

export interface IUser extends INewUser {
  id: number;
}