import knexLib from "knex";

const knex = knexLib({
  client: "sqlite3",
  connection: {
    filename: "./sqlite.db",
  },
});

export default knex;