import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const Chatting = () => {
  const [client, setClient] = useState(null);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState('');

    useEffect(() => {
        // MQTT 브로커에 연결 (WebSocket 프로토콜 사용)
        const mqttClient = mqtt.connect('ws://localhost:8083'); // 브로커의 WebSocket 포트로 연결

        // 연결 성공 시
        mqttClient.on('connect', () => {
            console.log('Connected to MQTT Broker');
            mqttClient.subscribe('test/topic', (err) => {
                if (!err) {
                    console.log('Subscribed to chat/topic');
                }
            });
        });

        // 메시지 수신 시
        mqttClient.on('message', (topic, message) => {
            console.log(message);
        });

        setClient(mqttClient);

        // 컴포넌트가 언마운트될 때 연결 종료
        return () => {
            mqttClient.end();
        };
    }, []);

    const handleSendMessage = () => {
        if (client) {
            // 메시지 발행 (해당 토픽에 메시지를 보냄)
            client.publish('test/topic', '{mag: "test", user: "user1", room:"1234"}');
            setMessageToSend(''); // 메시지 전송 후 입력창 초기화
        }
    };

    return (
        <div>
            <h1>MQTT Chat Application</h1>
            <input
                type="text"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                placeholder="Type your message"
            />
            <button onClick={handleSendMessage}>Send</button>
            <h2>Received Messages:</h2>
            <ul>
                {receivedMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chatting;