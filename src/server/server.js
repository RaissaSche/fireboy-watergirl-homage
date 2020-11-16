const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let socketId1 = -1;
let socketId2 = -1;
let interval;
let player1Pos = [50, 450];
let player2Pos = [740, 450];

io.on("connection", (socket) => {
  console.log("New client connected");

  if (socketId1 === -1) {
    socketId1 = socket.id;
  }
  if (socketId2 === -1 && socketId1 !== socket.id) {
    socketId2 = socket.id;
  }

  if (socket.id === socketId1) {
    socket.join("player1");
  }

  if (socket.id === socketId2) {
    socket.join("player2");
  }

  console.log(socketId1, socketId2);

  if (interval) {
    interval = "";
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("hey", (data) => {
    //console.log(data);

    if (data[0] === 0) {
      player1Pos[0] = data[1];
      player1Pos[1] = data[2];
    }
    if (data[0] === 1) {
      player2Pos[0] = data[1];
      player2Pos[1] = data[2];
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    interval = "";
  });
});

const getApiAndEmit = (socket) => {
  const response = {
    id: 0,
    posX1: player1Pos[0],
    posY1: player1Pos[1],
    posX2: player2Pos[0],
    posY2: player2Pos[1],
  };
  const response2 = {
    id: 1,
    posX1: player1Pos[0],
    posY1: player1Pos[1],
    posX2: player2Pos[0],
    posY2: player2Pos[1],
  };

  // Emitting a new message. Will be consumed by the client
  io.to("player1").emit("FromAPI", response);
  io.to("player2").emit("FromAPI", response2);
};

// io.on("connection", (socket)=>{
//   socket.on("move", (msg)=>{
//     io.emit("move", msg);
//   });
// });

server.listen(port, () => console.log(`Listening on port ${port}`));
