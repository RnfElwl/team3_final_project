import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const ChatApp = () => {
  const [client, setClient] = useState(null);    // MQTT 클라이언트 상태
  const [isConnected, setIsConnected] = useState(false);  // 연결 상태
  const [messages, setMessages] = useState([]);  // 수신된 메시지 상태
  const [message, setMessage] = useState('');    // 입력된 메시지 상태
  const [nickname, setNickname] = useState('');  // 유저 닉네임 상태
  const [room, setRoom] = useState('room1');     // 채팅방 상태

  // MQTT 브로커 연결 설정
  useEffect(() => {
    const options = {
      keepalive: 30,
      clientId: 'react-client-' + Math.random().toString(16).substr(2, 8),
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      username: 'your_username',   // 필요한 경우
      password: 'your_password',   // 필요한 경우
    };

    // WebSocket을 통한 MQTT 연결 (ws:// 브로커 URL 사용)
    const mqttClient = mqtt.connect('ws://localhost:8083/mqtt', options);

    // MQTT 연결 성공
    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker');
      setIsConnected(true);

      // 특정 채팅방 구독
      mqttClient.subscribe(`chat/${room}`, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    });

    // 메시지 수신
    mqttClient.on('message', (topic, payload) => {
      const receivedMessage = payload.toString();
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    // MQTT 연결 에러 처리
    mqttClient.on('error', (err) => {
      console.error('Connection error:', err);
      mqttClient.end();
    });

    setClient(mqttClient);

    return () => {
      // 컴포넌트 언마운트 시 연결 해제
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, [room]);

  // 메시지 전송
  const sendMessage = () => {
    if (client && isConnected && message.trim()) {
      const messageObj = {
        sender: nickname || 'Anonymous', // 유저 닉네임
        message: message,
      };

      // MQTT 브로커로 메시지 발행
      client.publish(`chat/${room}`, JSON.stringify(messageObj));
      setMessage(''); // 메시지 입력 필드 초기화
    }
  };

  return (
    <div>
      <h1>MQTT 기반 채팅</h1>

      {/* 유저 닉네임 입력 */}
      <div>
        <label>닉네임: </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
        />
      </div>

      {/* 채팅방 선택 */}
      <div>
        <label>채팅방 선택: </label>
        <select value={room} onChange={(e) => setRoom(e.target.value)}>
          <option value="room1">Room 1</option>
          <option value="room2">Room 2</option>
          <option value="room3">Room 3</option>
        </select>
      </div>

      {/* 메시지 입력 */}
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage}>전송</button>
      </div>

      {/* 메시지 출력 */}
      <div>
        <h2>채팅방: {room}</h2>
        <div>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
