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
import express, { json } from "express";
import http from "http";
import WebSocket from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("chat"));
app.get("/*", (req, res) => res.redirect("/")); // 어떤 URL 을 입력해도 home 로 리다이렉트 해주는 코드

// http: , ws: 둘다 가능
const handleListen = () => console.log(`Listening on http://localhost:5000`);

// http 서버 와 webSocket 서버 둘 다 사용하기 webSocket 서버만 사용해도 된다.
// http 서버 위에 webSocket  서버를 만들 수 있도록 하기
const httpServer = http.createServer(app); // http 서버
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credential: true,
  },
}); // socket.io 서버 설정

instrument(io, {
  auth: false,
});

function publicRooms() {
  // const sids = io.sockets.adpater.sids;
  // const rooms = io.sockets.adpater.rooms;

  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

// 여기서 부터 socket.io 코드
io.on("connection", (socket) => {
  // websocket 이 아니라 socketIO 의 socket 이다.
  // console.log("!!!", io.sockets.adapter);
  socket.onAny(() => {});

  socket.on("join_room", (roomName, nick_name, showRoom) => {
    socket["nickname"] = nick_name;
    // socket io 가 알아서 javascript object로 만들어준다.
    // console.log(data);
    socket.join(roomName);
    showRoom();
    // 나를 제외한 방에 있는 다른 사람에게 메시지를 보낸다.
    // socket io 는 이게 가능하다.
    socket.to(roomName).emit("welcome", nick_name, countRoom(roomName));
    io.sockets.emit("room_change", publicRooms());
  });

  // 채팅방 나감
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
    socket.on("disconnect", () => {
      io.sockets.emit("room_change", publicRooms());
    });
  });

  // 채팅 메세지 보냄
  socket.on("new_message", (chat_message, room_name, done) => {
    socket
      .to(room_name)
      .emit("new_message", `${socket.nickname} : ${chat_message}`);
    done();
  });

  // sk.on("speech_to_text", (room_name, text) => {
  //   // console.log(" room_name = ", room_name);
  //   // console.log(" text = ", text);
  //   sk.to(room_name).emit("stt", text);
  // });

  // 닉네임 설정
  // sk.on("nickname", (nick) => (sk["nickname"] = nick));
});

httpServer.listen(5000, handleListen);
