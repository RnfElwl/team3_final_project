import React, { useEffect, useState } from 'react';
import "../../css/chat/chtting.css";
import axios from '../../component/api/axiosApi.js';
import mqtt from 'mqtt';
import { useParams } from 'react-router-dom';

const Chatting = () => {
  const [client, setClient] = useState(null);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState('');
    const {chatlist_url } = useParams();
    let userid = 'goguma1234';
    let once = 0;
    useEffect(() => {

        getUser()
        // MQTT 브로커에 연결 (WebSocket 프로토콜 사용)
        const mqttClient = mqtt.connect('ws://localhost:8083'); // 브로커의 WebSocket 포트로 연결

        // 연결 성공 시
        mqttClient.on('connect', () => {
            console.log('Connected to MQTT Broker');
            mqttClient.subscribe(`test/topic/${chatlist_url}`, (err) => {
                if (!err) {
                    console.log('Subscribed to chat/topic');
                }
            });
        });

        // 메시지 수신 시
        mqttClient.on('message', (topic, message) => {
            const decoding = new TextDecoder("utf-8").decode(message);
            setReceivedMessages(p=>[...p, JSON.parse(decoding)])
        });

        setClient(mqttClient);

        // 컴포넌트가 언마운트될 때 연결 종료
        return () => {
            mqttClient.end();
        };
    
    }, []);
    async function getUser(){
        const result = await axios.get('http://localhost:9988/user/userinfo');
        userid = result.data;
    }
    const handleSendMessage = () => {
        if (client) {
            // 메시지 발행 (해당 토픽에 메시지를 보냄)
            const data = {msg: messageToSend, userid, room:chatlist_url}            
            client.publish(`test/topic/${chatlist_url}`, JSON.stringify(data));
            setMessageToSend(''); // 메시지 전송 후 입력창 초기화
        }
    };

    return (
        <div className='container chatting_room'>
            <h1>MQTT Chat Application</h1>
            <h2>Received Messages:</h2>
            <ul>
                {receivedMessages.map((data, index) => (
                    <>
                    {
                    userid==data.userid?
                    <div className='myText'>
                        <div><img  src={`${data.userprofile}`}/></div>
                        <div>

                            <div>{userid}닉네임들어갈 자리 (현재 아이디들가있음)</div>
                            <div>
                                <div>
                                    <div>
                                        {data.msg}
                                    </div>
                                    <div>
                                        {data.chat_date}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                     : 
                     <li>{data.msg}</li>
                    }
                    </>
                ))}
            </ul>
            <div className='chatting_input'>
                <input
                    type="text"
                    value={messageToSend}
                    onChange={(e) => setMessageToSend(e.target.value)}
                    placeholder="Type your message"
                    />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatting;