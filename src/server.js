import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, nickName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer_res", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer_res", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice_res", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:5000`);
httpServer.listen(5000, handleListen);
