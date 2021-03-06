# Noom

Zoom Clone using WebRTC and WebSocket


[참고 : MDN getUserMedia()](https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia)


## npm 라이브러리

- npm i ws =>  node.js webSocket library (사용하기 편하고, 아주 빠르다)

- npm i -g localtunnel => local tunnel 은 서버를 전세계와 공유하게 해준다.

- npm i @socket.io/admin-ui

- lt --port 3000 => URL 생성

## git convention

- feat: 새로운 기능 추가 
- fix: 버그 픽스 
- docs: 문서 수정
- style: 포맷,  세미콜론 수정, Optimize import, Code clean up 등 코드가 아닌 스타일에 관련된 수정 
- refactor: 코드 리펙토링
- test: 테스트 코드 추가
- chore: 빌드 관련 업무 수정(안드로이드의 경우 builde.gradle, manifest)


## HTTP vs WebSockets

### 웹 소켓이란?


웹 소켓이란 두 프로그램 간의 메세지를 교환하기 위한 통신 방법 중 하나이다.

webSockets 을 이용해서 실시간 통신을 할 수 있다.

### 웹 소켓의 특징

#### 양방향 통신 (Full-Duplex)

- 데이터 송수신을 동시에 처리할 수 있는 통신 방법
- 클라이언트와 서버가 서로에게 원할 때 데이터를 주고 받을 수 있다.
- 통상적인 Http 통신은 Client 가 요청을 보내는 경우에만 Server가 응답하는 단방향 통신


#### 실시간 네트워킹(Read Time-Networking)

- 웹 환경에서 연속된 데이터를 빠르게 노출
- Ex) 채팅 , 주식 , 비디오 데이터
- 여러 단말기에 빠르게 데이터를 교환
  
### 웹 소켓 이전의 비슷한 기술

#### Polling

![image](https://user-images.githubusercontent.com/66653324/178109895-d14663db-de99-4388-af97-21fd59742beb.png)

- 서버로 일정 주기 요청 송신
- real-time 통신에서는 언제 통신이 발생할지 예측이 불가능 , 불필요한 request 와 connection을 생성
- real-time 이라고 부르기 애매한 실시간 성


#### Long Polling

![image](https://user-images.githubusercontent.com/66653324/178109984-7af8e182-5380-4069-b43f-78d148194b38.png)

- 서버에 요청을 보내고 이벤트가 생겨 응답 받을 때 까지 연결 종료 X
- 응답을 받으면 끊고 다시 재요청
- 많은 양의 메시지가 쏟아지면 Polling 과 같다.

#### Streaming

![image](https://user-images.githubusercontent.com/66653324/178110044-1361950a-2bf3-4060-844f-ceee0f1604e0.png)


- 서버에 요청 보내고 끊기지 않는 연결 상태에서 끊임없이 데이터 수신
- 클라이언트에서 서버로의 데이터 송신이 어렵다. 



#### 정리

위의 모든 방법이 HTTP 를 통해 통신하기 때문에

Request , Response 둘 다 Header 가 불필요하게 크다.

### 웹 소켓 동작 방법

![image](https://user-images.githubusercontent.com/66653324/178110303-abb03b19-cab9-4fdd-a480-be22b22a7c7a.png)



### Http 와 webSocket

- 둘 다 프로토콜이다.

![image](https://user-images.githubusercontent.com/66653324/178109461-20a53fb0-6feb-4f55-9e7c-95e682fc14e6.png)

http 는 request 가 있어야 response 가 가능하다.

즉 , http는 stateless 이다.

하지만 webSocket 은 서버도 메시지를 보낼 수 있다.

request-response 과정이 필요 없다.



### 서버는 2개의 브라우저와 연결되어있다.

하지만 브라우저 끼리 통신은 하지 않고

각각 서버와 데이터를 주고 받고 있다.

브라우저 끼리도 데이터를 주고 받으려면 어떻게 해야할까?

서로 누가 연결되어 있는지 모르니깐 누가 연결되어 있는지 알려줘야 한다.


### fake database 생성

각 클라이언트의 소켓을 배열에 담은 뒤 
배열에 담긴 소켓 리스트에 받은 메시지를 다시 전송한다.


ex)

```javascript
// fake database , 누가 연결되어 있는지 알기 위해서
// 서버에 연결된 브라우저를 담자
const socket_info = [];
```

### SOCKET. IO framework 사용하기 


채팅으로 다른 클라이언트에게 메세지를 보낼 때
나를 제외한 다른 클라이언트에게만 메세지를 보내고 싶다.

그리고 json -> string , string -> json 과 같은 작업이 번거로운데
이것을 간단하게 할 방법이 있을까??

메시지가 여러 종류라면 , 이것을 구분하기 위해 switch - case 문과 같이
조건 분기를 해줘야 하는데, 간단하게 해결하는 방법이 있을까?

클라이언트끼리 채팅을 주고 받기 위해 fake database 를 만들어서 
모든 클라이언트에게 데이터를 전송하는데, 이때 특정 클라이언트가 연결이 끊겼을 때, 어떻게 확인해야 할까? 

연결된 클라리언트가 몇명인지 확인하고 싶은데 어떻게 알 수 있을까?

#### SOCKET IO 프레임워크를 사용하자 !!

#### [홈페이지](https://socket.io/)

Socket.IO enables real-time , bidirectinal and event-based communication.

It works on every platform, browser or device , focusing 
equally on reliability and speed


![image](https://user-images.githubusercontent.com/66653324/178130811-4987fa45-19fc-4fd2-91bd-ccd8ecea75b0.png)



#### webSocket 과 차이점은?

webSocket 은 SOCKET IO 가 실시간 , 양방향 , event 기반 통신을 제공하는
방법 중 하나일 뿐이다. 

SOCKET IO 는 "websocket 의 부가기능" 이 아니다.

만약 websocket 이용이 불가능하면, socket IO 는 다른 방법을 이용해서
계속 작동한다 (예를 들어,  HTTP long pollng 같은 방법)

### Adapter

[홈페이지](https://socket.io/docs/v4/adapter/)

- Adapter 는 다른 서버들 사이에 실시간 어플리케이션을 동기화 한다.



## Video Chat

### SOCKET.IO => WebRTC


WebRTC 를 사용하면 peer-to-peer 통신이 가능하다.

즉, 영상과 오디오, 텍스트가 서버를 통해 전달 되는 것이 아니라
직접 다른 클라이언트에게 간다는 뜻이다.

서버가 필요없다. 그레서 실시간 (real time) 이 속도가 엄청 빠른 것이다.

오디오,텍스트가 서버에 업로드 되고 
클라이언트가 실시간으로 서버에서 다운 받는다면 

서버는 비용이 너무 많이 든다.

사실 web RTC 가 서버가 아예 없는 것은 아니다.
단지, 영상이나 오디오를 전송하기 위해 필요 하지 않을 뿐이다, 

![image](https://user-images.githubusercontent.com/66653324/178139082-587b9173-4ffc-4780-86a9-9699d7d232e7.png)

서버가 필요한 이유는 다른 클라이언트의 위치를 알려 주기 때문이다.


### peer-to-peer process

![image](https://user-images.githubusercontent.com/66653324/178140878-cf9c66c2-91d7-4c52-abf6-77254674d52d.png)



### web RTC IceCandidate

[홈페이지](https://developer.mozilla.org/ko/docs/Web/API/RTCIceCandidate)


Internet Connectivity Establishment (인터넷 연결 생성)

- IceCandidate 는 webRTC  에 필요한 프로토콜이다.
- 멀리 떨어진 장치와 소통할 수 있게 하기 위한 프로토콜과 라우팅을 의미
- 브라우저가 서로 소통할 수 있게 해주는 방법이다.
- 두 단말이 서로 통신할 수 있는 최적의 경로를 찾을 수 있도록 도와주는 프레임워크? 이다


### web RTC RtpSender

[홈페이지](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender)

- Sender 는 우리의 peer로 보내진 media stream track 을 컨트롤하게 해준다.


### STUN server (Session Traversal Utilities for NATZ)
  
- NAT 환경에서는 Private IP 를 별도로 가지고 있기 때문에 Peer-to-Peer 통신이 불가능 하다.
- 따라서 클라이언트는 자신의 public IP를 확인하기 위해 STUN 서버로 요청을 보낸다.
- 이후 서버로 부터 자신의 public IP 를 받는다.
- STUN 서버는 컴퓨터가 공용 IP 주소를 찾게 해준다.
- 어떠한 것을 request 함녀 인터넷에서 네가 누군지를 알려주는 서버이다.


![image](https://user-images.githubusercontent.com/66653324/178146533-94a9011c-c34b-4c17-ac78-e3f6f2a390cb.png)


### RTC Data Channel

- Data Channel 은 peer-to-peer 유저가 언제든지 모든 종류의 데이터를 주고 받을 수 있는 채널이다.
- 이미지 ,오디오 뿐 아니라 파일 , 텍스트, 게임 업데이트 패킷 같은 것들도 주고 받을 수 있다.


### Web RTC 를 쓰면 안되는 곳

- peer 가 많은 곳 (peer 수가 많으면 느려진다. )


![image](https://user-images.githubusercontent.com/66653324/178147095-dbbfe0da-d6f8-4b5e-9ddc-9d47ffeeb36b.png)

현재 web RTC 는 mesh 방식이다.


### 서버의 종류

WebRTC 를 위해 개발자가 구현할 수 있는 서버는 
크게 세 종류가 있다.

Signaling (mesh) , SFU , MCU 이다.


#### Signaling 서버 (Mesh)

- 특징
  - peer 간의 offer , answer 라는 session 정보 signal 만을 중계한다. 따라서 처음 WebRTC가 peer 간의 정보를 중계할 때만 서버에 부하가 발생한다.
  - peer 간 연결이 완료된 후에는 서버에 별도의 부하가 없다.
  - 1:1 연결에 적합하다.

- 장점
  - 서버의 부하가 적기 때문에 서버 자원이 적게든다.
  - peer 간의 직접 연결로 데이터를 송수신하기 때문에 실시간 성이 보장된다.

- 단점
  - N:N 연결에서 클라이언트의 과부하가 급격하게 증가한다. 예를 들어 위의 그림같이 5인이 WebRTC 연결을 한다고 가정하면 Uplink(나의 데이터를 연결된 다른 사용자에게 보내는 갯수) 4개 , Downlink(연결된 다른 사용자의 데이터가 나에게 들어오는 갯수) 4개로 한 명당 총 8개의 link를 유지하며 데이터를 송수신하게 된다.


#### SFU (Selective Forwarding Unit) 서버 

- 특징
  - 종단 간 미디어 트래픽을 중계하는 중앙 서버 방식이다.
  - 클라이언트 peer 간 연결이 아닌 , 서버와 클라이언트 간의 peer 를 연결한다.
  - 1:1 ,1:N , 1:N , N:N 등 모든 연결 형식에서 클라이언트는 연결된 모든 사용자에게 데이터를 보낼 필요없이 서버에게만 자신의 영상 데이터를 보내면 된다.(즉, Uplink가 1개이다.)
  - 하지만 1:N , N:N 형식이라면 상대방의 수만큼 데이터를 받는 peer 를 유지해야 한다. (Downlink 는 P2P(Signaling 서버) 일 때와 동일하다.)
  - 1:N 형식 또는 소규모 N:N 형식의 실시간 스트리밍에 적합하다.


- 장점
  - 데이터가 서버를 거치고 Signaling 서버를 사용할 때 보다 느리긴하지만 비슷한 수준의 실시간 성을 유지할 수 있다. 
  - Signaling 서버를 사용하는 것보다 클라이언트가 받는 부하가 줄어든다.


- 단점
  - Signaling 서버보다 서버 비용이 증가한다.
  - 대규모 N:N 구조에서 여전히 클라이언트가 많은 부하를 감당한다.


### MCU (Multi - point Control Unit) 서버

- 특징
  - 다수의 송출 미디어를 중앙 서버에서 혼합 또는 가공하여 수신측으로 전달하는 중앙 서버 방식이다. 예를 들어, 5인이 WebRTC 연결을 한다면 자신의 제외한 다른 4인의 video 데이터를 하나의 video 데이터로 편집하고, audio 데이터도 마찬가지로 편집하여 한 명에게 보낸다. 이 작업을 남은 4명에게도 동일하게 적용한다.
  - 클라이언트 peer 간 연결이 아닌 , 서버와 클라이언트 간의 peer 를 연결한다.
  - 모든 연결 형식에서 클라이언트는 연결된 모든 사용자에게 데이터를 보낼 필요 없이 서버에게만 자신의 영상 데이터를 보내면 된다. (즉, Uplink가 1개다)
  - 모든 연결 형식에서 클라이언트는 연결된 사용자의 수와 상관없이 서버에게서 하나의 peer 로 데이터를 받으면 된다. (즉, Downlink가 1개 이다.)
  - 중앙 서버의 높은 컴퓨팅 파워가 요구된다.


- 장점 
  - 클라이언트의 부하가 현저히 줄어든다. (항상 Uplink 1개 ,Downlink 1개 총 2개)
  - 다른 서버 보다 N:M 구조에 적합하다.

- 단점 
  - WebRTC 의 최대 장점인 실시간성이 저해된다.
  - video , audio 를 결합하는 과정에서 비용이 많이 든다.


