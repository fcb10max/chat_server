import dotenv from "dotenv";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./dataTypes/socket-io-types";
import cookieParser from "cookie-parser";
import router from "./router";

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

io.on("connection", (client) => {
  console.log("connected");

  client.on("disconnect", (reason) => {
    console.log("Disconnecting... Reason: ", reason);
  });
});

app.use("/api", router);

httpServer.listen(3000);
