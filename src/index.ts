import dotenv from "dotenv";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketType,
  SocketData,
} from "./dataTypes/socket-io-types";
import router from "./router";
import { message, users } from "./socketEvents";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  cookie: true,
});

io.use((socket, next) => {
  const { username, userID } = socket.handshake.auth;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.userID = userID;
  next();
});

const onConnection = (client: SocketType) => {
  message(io, client);
  users(io, client);

  client.on("disconnect", (reason) => {
    console.log("Disconnecting... Reason: ", reason);
  });
};

io.on("connection", onConnection);

app.use("/api", router);

httpServer.listen(3000);
