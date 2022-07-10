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
