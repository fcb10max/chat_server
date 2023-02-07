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
import { handleConnectDisconnect, message, users } from "./socketEvents";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5000",
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
  const { username, id } = socket.handshake.auth;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.userID = id;
  next();
});

const onConnection = (client: SocketType) => {
  handleConnectDisconnect(io, client)
  message(io, client);
  users(io, client);
};

io.on("connection", onConnection);

app.use("/api", router);

httpServer.listen(3000);
