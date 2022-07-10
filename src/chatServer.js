import express, { json } from "express";
import http from "http";
import WebSocket from "ws";
import SocketIO from "socket.io";

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
const io = SocketIO(server); // socket.io 서버 설정

// web socket 코드  모두 주석 처리
// const wss = new WebSocket.Server({ server }); // webSocket 서버

/* // fake database , 누가 연결되어 있는지 알기 위해서
// 서버에 연결된 브라우저를 담자
const socket_info = [];

wss.on("connection", (s) => {
  console.log("connect ! ! ");
  s["nickname"] = "Anon";
  // 메시지를 보낼 때마다 추가 하는 것은 아니다.
  // 그냥 새로운 클라이언트가 연결 될 때만 추가 된다
  socket_info.push(s); // firefox , chrome , edge 등 각 클라이언트를 담는다.
  s.on("close", () => {
    console.log("Disconnected from Client");
  });
  // s.send("hello !!");
  // client 에서 string 으로 변환된 json object 를 보냄
  s.on("message", (m) => {
    // s.send(m); // 클라이언트에서 받은 채팅 메시지를 다시 클라이언트에게 보낸다
    const message = JSON.parse(m);

    switch (message.type) {
      case "chat_message":
        // 연결된 모든 Socket에 접근하고 메시지를 보낸다.
        socket_info.forEach((each_client) =>
          each_client.send(`${s.nickname} : ${message.payload}`)
        );
        break;
      case "nickname":
        // console.log("nickname = ", message.payload);
        s["nickname"] = message.payload;
        break;
    }
  });
}); */

// 여기서 부터 socket.io 코드
io.on("connection", (sk) => {
  // websocket 이 아니라 socketIO 의 socket 이다.

  sk.onAny(() => {});

  sk.on("join_room", (roomName, showRoom) => {
    // socket io 가 알아서 javascript object로 만들어준다.
    // console.log(data);
    sk.join(roomName);
    showRoom();
    // 나를 제외한 방에 있는 다른 사람에게 메시지를 보낸다.
    // socket io 는 이게 가능하다.
    sk.to(roomName).emit("welcome");
  });

  // 채팅방 나감
  sk.on("disconnecting", () => {
    sk.rooms.forEach((room) => sk.to(room).emit("bye"));
  });

  // 채팅 메세지 보냄
  sk.on("new_message", (chat_message, room_name, done) => {
    sk.to(room_name).emit("new_message", chat_message);
    done();
  });
});

server.listen(3000, handleListen);
