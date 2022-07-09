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

server.listen(3000, handleListen);
