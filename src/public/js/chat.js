const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (m) => {
  console.log("Just got this : ", m.data, " from Server");
  const li = document.createElement("li");
  li.innerText = m.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

// setTimeout(() => {
//   socket.send("hello from the browser !");
// }, 3000);

// makeMessage 함수를 이용해서 json 형식을 string 으로 변환해서
// 서버로 보냄
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("chat_message", input.value)); // 클라이언트에서 메시지를 보낸다.
  input.value = "";
});

// makeMessage 함수 사용하지 않고 json 을 바로 string 으로 변환해서
// 클라이언트로 데이터 전송
nickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(
    JSON.stringify({
      type: "nickname",
      payload: input.value,
    })
  );
});
