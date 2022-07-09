# Noom

Zoom Clone using WebRTC and WebSocket


[참고 : MDN getUserMedia()](https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia)


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

