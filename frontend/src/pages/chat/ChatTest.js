import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const ChatApp = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // MQTT 클라이언트 생성 및 연결
    const mqttClient = mqtt.connect('ws://localhost:1883'); // WebSocket을 통해 연결

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe('chat/topic', (err) => {
        if (!err) {
          console.log('Subscribed to chat/topic');
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      const msg = message.toString();
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setClient(mqttClient);

    // 컴포넌트 언마운트 시 MQTT 클라이언트 종료
    return () => {
      mqttClient.end();
    };
  }, []);

  const handleSend = () => {
    if (client && input) {
      client.publish('chat/topic', input);
      setInput('');
    }
  };

  return (
    <div>
      <h1>MQTT Chat</h1>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatApp;