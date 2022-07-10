// const messageList = document.querySelector("ul");
// const nickForm = document.querySelector("#nick");
// const messageForm = document.querySelector("#message");
// const socket = new WebSocket(`ws://${window.location.host}`);

// // 백엔드에서 어떤 프로그래밍 언어를 사용하는지 모르기 때문에
// // object 를 string 으로 변환해줘야 한다.
// function makeMessage(type, payload) {
//   const msg = { type, payload };
//   return JSON.stringify(msg);
// }

// socket.addEventListener("open", () => {
//   console.log("Connected from Server ✅");
// });

// socket.addEventListener("message", (m) => {
//   console.log("Just got this : ", m.data, " from Server");
//   const li = document.createElement("li");
//   li.innerText = m.data;
//   messageList.append(li);
// });

// socket.addEventListener("close", () => {
//   console.log("Disconnected from Server ❌");
// });

// // setTimeout(() => {
// //   socket.send("hello from the browser !");
// // }, 3000);

// // makeMessage 함수를 이용해서 json 형식을 string 으로 변환해서
// // 서버로 보냄
// messageForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const input = messageForm.querySelector("input");
//   socket.send(makeMessage("chat_message", input.value)); // 클라이언트에서 메시지를 보낸다.
//   const li = document.createElement("li");
//   li.innerText = `나 : ${input.value}`;
//   messageList.append(li);
//   input.value = "";
// });

// // makeMessage 함수 사용하지 않고 json 을 바로 string 으로 변환해서
// // 클라이언트로 데이터 전송
// nickForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   const input = nickForm.querySelector("input");
//   socket.send(
//     JSON.stringify({
//       type: "nickname",
//       payload: input.value,
//     })
//   );
//   input.value = "";
// });

// 위에 코드 들이 webSocket 코드
// 아래 부터 socket io 코드

const socket = io(); // io 는 자동적으로 back-end socket.io 와 연결 해주는 function
// 크롬 브라우저 콘솔 에 입력하면 io 라는 function 을 볼 수 있다.
// io function이 알아서 socket.io 를 실행하고 있는 서버를 찾는다.

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const chatRoom = document.getElementById("chat_room");
const chat_form = document.getElementById("msg");
const nickname_form = document.getElementById("nickname");
let roomName;

chatRoom.hidden = true;

function showRoom() {
  welcomeForm.hidden = true;
  chatRoom.hidden = false;
  const room_header = document.querySelector("h3");
  room_header.innerText = `Room : ${roomName}`;
}

//닉네임 설정
nickname_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickname_form.querySelector("input");
  socket.emit("nickname", input.value);
});

// 채팅 메세지 전송
chat_form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chat_form.querySelector("input");
  const msg = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`나 : ${msg}`);
  });
  input.value = "";
});

// 채팅 방 입장
welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value;
  // webSocket 과 다르게 json stringfy 할 필요가 없다.
  // socket io 는  object 를 사용할 수 있기 때문이다.
  // socket io가 알아서 string 을 object 로 바꿔준다.
  // socket io 는 webSocket 과 다르게 emit 을 사용하여
  // 원하는 event 명을 사용 할 수 있다.
  socket.emit("join_room", input.value, showRoom);
  // socket io 는 여러 개의 argument 를 서버에 보낼 수 있다.
  input.value = "";
});

function addMessage(message) {
  const ul = chatRoom.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

// socket io 에서는 더이상 socket.addEventListener 를 사용안해도 된다.
socket.on("welcome", (nickname) => {
  addMessage(`${nickname} joined!`);
});

socket.on("bye", (nickname) => {
  addMessage(`${nickname} left!`);
});

socket.on("new_message", (msg) => {
  addMessage(msg);
});
