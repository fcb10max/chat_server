import sqlite3 from "sqlite3";

export default new sqlite3.Database(
  "./sqlite.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err);
  }
);