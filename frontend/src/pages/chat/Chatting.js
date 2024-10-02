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
    const [isConnected, setIsConnected] = useState(false); // 연결 상태 확인용
    let userData = {}// 아이디 갖고오는거 못해서 더미로 일단 이거
    let once = 0;
    const userid="";
    useEffect(() => {
        getUser()
        if(once == 0){
            once = 1;
            setChatContent();
        }
        // MQTT 브로커에 연결 (WebSocket 프로토콜 사용)
        const mqttClient = mqtt.connect('ws://localhost:8083'); // 브로커의 WebSocket 포트로 연결

        // 연결 성공 시
        mqttClient.on('connect', () => {
            console.log('Connected to MQTT Broker');
            mqttClient.subscribe(`test/topic/${chatlist_url}`, (err) => {
                console.log("누군지 모르겠지만연결됨");
                if (!err) {
                    console.log('Subscribed to chat/topic');
                }
            });
        });
        // 연결이 끊어졌을 때
        mqttClient.on('disconnect', () => {
        console.log('연결 끊김');
        
      });
        // 메시지 수신 시
        mqttClient.on('message', async (topic, message) => {
            const decoding = new TextDecoder("utf-8").decode(message);
            console.log(decoding);
            setReceivedMessages(p=>[...p, JSON.parse(decoding)])
        });

        // 연결이 끊어졌을 때
    mqttClient.on('disconnect', () => {
        console.log('Disconnected from MQTT Broker');
        setIsConnected(false); // 연결 상태를 false로 설정
      });
  
      // 연결이 닫혔을 때
      mqttClient.on('close', () => {
        console.log('MQTT connection closed');
        setIsConnected(false); // 연결 상태를 false로 설정
      });
  
      // 연결이 오프라인 상태일 때
      mqttClient.on('offline', () => {
        console.log('MQTT is offline');
        setIsConnected(false); // 연결 상태를 false로 설정
      });
        setClient(mqttClient);

        // 컴포넌트가 언마운트될 때 연결 종료
        return () => {
            mqttClient.end();
        };
    
    }, []);

    
    async function setChatContent(){
        const {data} = await axios.get(`http://localhost:9988/chat/${chatlist_url}`);
        data.map((d, i)=>{
            setReceivedMessages(p=>[...p, d])
        })
        console.log(data);

    }
    async function getUser(){
        const result = await axios.get('http://localhost:9988/user/userinfo');
        const params = {userid : result.data};
        console.log(params);
        const result2 = await axios.get('http://localhost:9988/getUserData', {params});
        userData = result2;
        console.log(userData);
    }

    const handleSendMessage = () => {
        if (client) {
            // 메시지 발행 (해당 토픽에 메시지를 보냄)
            
            const data = {chat_content: messageToSend, userid: userData.userid , chatlist_url, usernick:userData.usernick, } 
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
                            {data.content_id}{data.userid}
                            <div>{data.usernick}</div>
                            <div>
                                <div>
                                    <div>
                                        {data.chat_content}
                                    </div>
                                    <div>
                                        {data.chat_date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     : 
                     <div className='anotherText'>
                        <div><img  src={`${data.userprofile}`}/></div>
                        <div>
                            {data.content_id}{data.userid}
                            <div>{data.usernick}</div>
                            <div>
                                <div>
                                    <div>
                                        {data.chat_content}
                                    </div>
                                    <div>
                                        {data.chat_date}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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