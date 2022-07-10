const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
// const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");
const words = document.getElementById("words");
let p;

call.hidden = true;

let myStream;
let muted = true;
let cameraOff = true;
let roomName;
let myPeerConnection;
let recognition;
let nickName;

async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];

    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      // camerasSelect.appendChild(option);
    });
    // console.log("devices = ", devices);
    // console.log("cameras = ", cameras);
  } catch (error) {
    console.log("error ", error);
  }
}

// 카메라 , 마이크를 가져온다.
async function getMedia(deviceId) {
  // console.log("getMedia 호출  = ", deviceId);
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };

  const cameraConstrains = {
    audio: true,
    // video: { deviceId: deviceId },
    video: { deviceId: { exect: deviceId } },
  };

  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains
    );
    console.log("myStream ", myStream);
    myFace.srcObject = myStream;
    if (!deviceId) {
      console.log("deviceId ? ", deviceId);
      myStream.getVideoTracks().forEach((track) => (track.enabled = false));
      myStream.getAudioTracks().forEach((track) => (track.enabled = false));
      await getCameras();
    }
  } catch (error) {
    console.log("error", error);
  }
}

// 음소커 on / off
muteBtn.addEventListener("click", () => {
  console.log("myStram.getAudioTracks() = ", myStream.getAudioTracks());
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (!muted) {
    muteBtn.innerText = "Unmuted";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
});

// 카메라 on / off
cameraBtn.addEventListener("click", () => {
  console.log("myStram.getVideoTracks() = ", myStream.getVideoTracks());
  myStream.getVideoTracks().forEach((track) => {
    console.log("track = ", track);
    track.muted = !track.muted;
    track.enabled = !track.enabled;
  });

  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
});

// 카메라 선택 안할 꺼야!!
// camerasSelect.addEventListener("input", async () => {
//   // console.log("cameraSelect / value ", camerasSelect.value);
//   await getMedia(camerasSelect.value);

//   // 카메라를 바꾸면 다른 브라우저에게도 적용이 돼야한다.
//   if (myPeerConnection) {
//     const videoTrack = myStream.getVideoTracks()[0];
//     const videoSender = myPeerConnection
//       .getSenders()
//       .find((sender) => sender.track.kind === "video");
//     videoSender.replaceTrack(videoTrack);
//   }
// });

// 방 선택하는 코드
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

let makeNewTextContent = function () {
  p = document.createElement("p");
  words.appendChild(p);
};

// 카메라 화면이 켜지고
// 카메라와 마이크를 불러온다.
async function initVidepChat() {
  welcome.hidden = true;
  call.hidden = false;

  // 카메라 , 마이크를 불러온다.
  await getMedia();
  makeConnection();
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.interimResults = true;
  recognition.lang = "ko-KR";
  recognition.start();
  // console.log("recognition  = ", recognition);

  recognition.onstart = function () {
    console.log("onstart ...");
    makeNewTextContent(); // 음성 인식 시작시마다 새로운 문단을 추가한다.
  };

  recognition.onend = function () {
    console.log("onend ... ");
    recognition.start();
  };

  recognition.onresult = function (e) {
    let texts = Array.from(e.results)
      .map((results) => results[0].transcript)
      .join("");

    console.log("texts = ", texts);
    // console.log("today = ", new Date());
    texts.replace(/느낌표|강조|뿅/gi, "❗️");

    p.textContent = `${nickName} : ${texts}`;
    // console.log("p = ", p);
  };
}

// 방 입장 코드
welcomeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const room_name = welcomeForm.querySelector("#room-name");
  const nick_name = welcomeForm.querySelector("#nick-name");

  await initVidepChat();
  socket.emit("join_room", room_name.value, nick_name.value);
  console.log("join room !!");
  roomName = room_name.value;
  nickName = nick_name.value;
  console.log("room_name =  ", room_name.value);
  console.log("nick_name =  ", nick_name.value);
  const h1 = call.querySelector("h1");
  h1.innerText = `Room : ${room_name.value}`;
  room_name.value = "";
});

// Socket Code

socket.on("welcome", async () => {
  // console.log("someone join");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("send offer ");
  socket.emit("offer", offer, roomName);
});

//  클라이언트끼리 연결하기 위해 서버에게 offer 를 먼저 보내야 한다.
socket.on("offer_res", async (o) => {
  console.log("received the offer = ");
  myPeerConnection.setRemoteDescription(o);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  console.log("sent the answer ");
  socket.emit("answer", answer, roomName);
});

socket.on("answer_res", (answer) => {
  console.log("received the answer ");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice_res", (ice) => {
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code

// 클라이언트 끼리 peer to peer 연결 하는 코드
function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        // 구글이 제공하는 무료 stun 서버
        // 내 어플리케이션을 만들 때는 여기에 의존하면 안된다.
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", (data) => {
    socket.emit("ice", data.candidate, roomName);
    // console.log("got ice candidate = ", data);
  });
  myPeerConnection.addEventListener("addstream", (data) => {
    console.log("got an stream from my peer !", data.stream);
    console.log("myStream", myStream);
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.stream;
  });

  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}
