import React, { useEffect, useState, useRef } from 'react';
import "../../css/chat/chtting.css";
import axios from '../../component/api/axiosApi.js';
import mqtt from 'mqtt';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Chatting = () => {
  const [client, setClient] = useState(null);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState('');
    const {chatlist_url } = useParams();
    const [isConnected, setIsConnected] = useState(false); // 연결 상태 확인용
    const [userData, setUserData] = useState({});
    const [myid, setMyid] = useState("");
    let once = 0;
    const chatting_box = useRef(null);
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
                userListAdd();
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

    }
    async function userListAdd(){
        const params = {chatlist_url};
        const {data} = await axios.post(`http://localhost:9988/chat/userlistadd/${chatlist_url}`);
    }
    async function getUser(){
        const result = await axios.get('http://localhost:9988/user/userinfo');
        setMyid(result.data);
        console.log(myid)
        const params = {userid : result.data};
        const result2 = await axios.get('http://localhost:9988/getUserData', {params});
        setUserData(result2);
    }

    const handleSendMessage = () => {
        if (client) {
            // 메시지 발행 (해당 토픽에 메시지를 보냄)
            const offset = new Date().getTimezoneOffset() * 60000;

            let today = new Date(Date.now() - offset);

            const now = today.toISOString().replace('T', ' ').substring(0, 19);
            const data = {
                content_id: uuidv4(),
                chat_content: messageToSend, 
                userid: userData.data.userid, 
                chatlist_url,
                usernick:userData.data.usernick, 
                userprofile: userData.data.userprofile,
                chat_date: now,
            } 
            client.publish(`test/topic/${chatlist_url}`, JSON.stringify(data));
            setMessageToSend(''); // 메시지 전송 후 입력창 초기화   
        }
    };
    function pressKeyboard(e){
        if(e.key==='Enter'){
            handleSendMessage();
        }
        
    }
    function scrollBottom(){

    }
    return (
        <div className='container chatting_room'>
            <div className='chatting_sub'>
                gdgd
            </div>
            <div className='chatting_box'>
                <h1>MQTT Chat Application</h1>
                <div className='chatting_list'>
                    {receivedMessages.map((data, index) => (
                        <>
                        {
                        

                        myid==data.userid?
                        <div className='myText'>
                            <div>
                                {data.content_id}{data.userid}
                                <div className='chat_usernick'>{data.usernick}</div>
                                <div className='chat_info'>
                                    <div className='chat_date'>
                                        {(data.chat_date).substring(11, 16)}
                                    </div>
                                    <div className='chat_text'>
                                        {data.chat_content}
                                    </div>
                                   
                                </div>
                            </div>
                            <div className='chat_profile'><img  src={`${data.userprofile}`}/></div>
                        </div>
                        : 
                        <div className='anotherText'>
                            <div className='chat_profile'><img  src={`${data.userprofile}`}/></div>
                            <div>
                                {data.content_id}{data.userid}
                                <div className='chat_usernick'>{data.usernick}</div>
                                <div className='chat_info'>
                                    <div className='chat_text'>
                                        {data.chat_content}
                                    </div>
                                    <div className='chat_sub_info'>
                                        <div className='chat_date'>
                                        {(data.chat_date).substring(11, 16)}
                                        </div>
                                        <div className='chat_read'>

                                        </div>
                                        <div className='chat_report'>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                        </>
                    ))}
                </div>
                <div className='chatting_input'>
                    <input
                        type="text"
                        value={messageToSend}
                        onKeyDown={pressKeyboard}
                        onChange={(e)=>setMessageToSend(e.target.value)}
                        placeholder="Type your message"
                        />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>

        </div>
    );
};

export default Chatting;