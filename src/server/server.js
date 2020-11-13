const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;
let playersPos = [50, 450, 740, 450];

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    interval = "";
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    interval = "";
  });
});

const getApiAndEmit = (socket) => {
  const response = {
    id: 0,
    posX1: playersPos[0],
    posY1: playersPos[1],
    posX2: playersPos[2],
    posY2: playersPos[3],
  };
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

io.on("connection", (socket) => {
  console.log(554);
  socket.on("hey", (data) => {
    console.log(data);
    playersPos[0] = data[0];
    playersPos[1] = data[1];
    playersPos[2] = data[2];
    playersPos[3] = data[3];
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
