const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

const call = document.getElementById("call");

call.hidden = true;

let myStream;
let muted = true;
let cameraOff = true;
let roomName;

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
      camerasSelect.appendChild(option);
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

    myFace.srcObject = myStream;
    if (!deviceId) {
      console.log("?????????");
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
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  }
});

async function handleCameraChange() {
  console.log("cameraSelect / value ", camerasSelect.value);
  await getMedia(camerasSelect.value);
}

camerasSelect.addEventListener("input", handleCameraChange);

// 방 선택하는 코드
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

function startMedia() {
  welcome.hidden = true;
  call.hidden = false;

  // 카메라 , 마이크를 불러온다.
  getMedia();
}

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startMedia);
  roomName = input.value;
  const h1 = call.querySelector("h1");
  h1.innerText = `Room : ${input.value}`;
  input.value = "";
});

// Socket Code

socket.on("welcome", () => {
  console.log("someone join");
});
