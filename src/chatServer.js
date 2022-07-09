import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("chat"));
app.get("/*", (req, res) => res.redirect("/")); // 어떤 URL 을 입력해도 home 로 리다이렉트 해주는 코드

// http: , ws: 둘다 가능
const handleListen = () => console.log(`Listening on http://localhost:3000`);

// http 서버 와 webSocket 서버 둘 다 사용하기 webSocket 서버만 사용해도 된다.
// http 서버 위에 webSocket  서버를 만들 수 있도록 하기
const server = http.createServer(app); // http 서버
const wss = new WebSocket.Server({ server }); // webSocket 서버

// fake database , 누가 연결되어 있는지 알기 위해서
// 서버에 연결된 브라우저를 담자
const socket_info = [];

wss.on("connection", (s) => {
  socket_info.push(s); // firefox , chrome , edge 등 각 클라이언트를 담는다.
  s.on("close", () => {
    console.log("Disconnected from Client");
  });
  // s.send("hello !!");
  s.on("message", (m) => {
    // s.send(m); // 클라이언트에서 받은 채팅 메시지를 다시 클라이언트에게 보낸다

    // 연결된 모든 Socket에 접근하고 메시지를 보낸다.
    socket_info.forEach((each_client) => each_client.send(m));
  });
});

server.listen(3000, handleListen);
