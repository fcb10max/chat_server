import { User } from "../dataTypes/user";
import db from "./connect";

interface IDBUser extends User {
  id: number
}
const data: IDBUser[] = [];

export default function (sqlQuery?: string) {
  const sql = `SELECT * FROM users;`;

  console.log("getUsers query: ", sqlQuery ?? sql);

  return new Promise<IDBUser[]>((resolve, reject) => {
    db.all(sqlQuery ?? sql, [], (err, rows) => {
      if (err) {
        return console.error("get users error: ", err.message);
      }
      rows.forEach((row) => {
        data.push(row);
      });
      resolve(data);
    });
  });
}
