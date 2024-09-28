import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Axios 라이브러리 임포트

const ChatTest = () => {
  const [message, setMessage] = useState(''); // 입력할 메시지 상태
    const [status, setStatus] = useState(''); // 서버 응답 상태

    // 메시지 전송 함수
    const sendMessage = async () => {
        try {
            // POST 요청을 통해 메시지 전송
            const response = await axios.post(`http://localhost:5000/send_message/${encodeURIComponent(message)}`);
            // 응답 상태 업데이트
            setStatus(response.data.status);
            setMessage(''); // 입력란 초기화
        } catch (error) {
            // 오류 발생 시 상태 업데이트
            console.error('Error sending message:', error);
            setStatus('Error sending message');
        }
    };

    return (
        <div>
            <h1>MQTT Chat</h1>
            {/* 메시지 입력란 */}
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)} // 입력 시 상태 업데이트
            />
            {/* 메시지 전송 버튼 */}
            <button onClick={sendMessage}>Send Message</button>
            {/* 서버 응답 상태 표시 */}
            {status && <p>Status: {status}</p>}
        </div>
    );
};

export default ChatTest;