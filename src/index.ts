// require("dotenv").config();

import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./dataTypes/socket-io-types";
// const supabase = require("@supabase/supabase-js")
import express from "express";
import cors from "cors";
import { createServer } from "http";
import checkNewUserDataValidity from "./helpers/checkNewUserValidity";
import addUser from "./db/addUser";

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, { cors: { origin: "*" } });

io.on("connection", (client) => {
  console.log("connected");

  client.on("newUser", async (user) => {
    const { isValid, errMsg } = await checkNewUserDataValidity(user);
    console.log(isValid);

    if (!isValid) {
      client.emit("authError", errMsg);
      console.log("emitted");
      console.log(errMsg);
    } else {
      addUser(user, client);
      io.emit("newUserAdded");
      console.log("added");
    }
  });

  client.on("disconnect", (reason) => {
    console.log("Disconnecting... Reason: ", reason);
  });
});

httpServer.listen(3000);
