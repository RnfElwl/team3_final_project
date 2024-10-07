import React, { useEffect, useState, useRef } from 'react';
import "../../css/chat/chtting.css";
import axios from '../../component/api/axiosApi.js';
import mqtt from 'mqtt';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineAlert } from "react-icons/ai";
const Chatting = () => {
    const date = new Date(); // 현재 날짜
    const options = {
        year: 'numeric',
        month: 'long', // 'short' 또는 '2-digit'으로 변경 가능
        day: 'numeric',
        weekday: 'long' // 요일
    };
  const [client, setClient] = useState(null);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState('');
    const {chatlist_url } = useParams();
    const [isConnected, setIsConnected] = useState(false); // 연결 상태 확인용
    const [userData, setUserData] = useState({});
    const [myid, setMyid] = useState("");
    const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
    const [report, setReport] = useState({});//폼에 있는 값들어있음
    let once = 0;
    const chatting_box = useRef(null);
    useEffect(() => {
        if(once == 0){
            once = 1;
            setChatContent();
        }
        const mqttClient = mqtt.connect('ws://localhost:8083'); // 브로커의 WebSocket 포트로 연결
        getUser()
        
        // MQTT 브로커에 연결 (WebSocket 프로토콜 사용)

        // 연결 성공 시
        mqttClient.on('connect', () => {
            console.log('Connected to MQTT Broker');
            mqttClient.subscribe(`test/topic/${chatlist_url}`, (err) => {
                console.log("누군지 모르겠지만연결됨");
                if (!err) {
                    console.log('Subscribed to chat/topic');
                }
                if(!mqttClient.connected){
                    return;
                }
                userListAdd(mqttClient);
            });
        });
        // 연결이 끊어졌을 때
        mqttClient.on('disconnect', () => {
        console.log('연결 끊김');
        
      });
        // 메시지 수신 시
        mqttClient.on('message', (topic, message) => {
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
    
    useEffect(() => {
        
        // 메시지가 변경될 때마다 실행
        scrollBottom();
        dateMsgSend()
        
      }, [receivedMessages, client]);

      async function dateMsgSend(){
        if(receivedMessages.length >= 1){
            const now = receivedMessages[receivedMessages.length -1].chat_date;
            if(!client){
                return ;
            }
            const info = {
                chatlist_url,
                chat_date: now,
                chat_type: 0
            }
            if(receivedMessages.length <= 1){
                console.log(receivedMessages)
                const box = [info, receivedMessages[0]];
                setReceivedMessages(box)
                return ;
            }
            const lastDay = (receivedMessages[receivedMessages.length -2].chat_date).substring(0, 10);
            if(lastDay!=now.substring(0, 10)){
                setReceivedMessages(p=>[...p, info])
            }
        }
    }
    
    async function setChatContent(){
        const {data} = await axios.get(`http://localhost:9988/chat/${chatlist_url}`);
        await data.map( async(d, i)=>{
            await setReceivedMessages(p=>[...p, d])
        })

    }
    
    async function getUser(){
        const result = await axios.get('http://localhost:9988/user/userinfo');
        setMyid(result.data);
        const params = {userid : result.data};
        const result2 = await axios.get('http://localhost:9988/getUserData', {params});
        setUserData(result2)
    }

    async function userListAdd(mqttClient){
        if(mqttClient){
            const result = await axios.get('http://localhost:9988/user/userinfo');
            setMyid(result.data);
            const params = {userid : result.data};
            const result2 = await axios.get('http://localhost:9988/getUserData', {params});
            const {data} = await axios.post(`http://localhost:9988/chat/userlistadd/${chatlist_url}`);
            const offset = new Date().getTimezoneOffset() * 60000;
            let today = new Date(Date.now() - offset);
            const now = today.toISOString().replace('T', ' ').substring(0, 19);
            const info = {  
                chatlist_url,
                usernick : result2.data.usernick, 
                chat_date: now,
                chat_type: 2
            } 
            
            if(data == 1){

                setReceivedMessages(receivedMessages)
                
                mqttClient.publish(`test/topic/${chatlist_url}`, JSON.stringify(info));
            }
        }
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
                chat_type: 1
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
        chatting_box.current.scrollTop = chatting_box.current.scrollHeight+10000;
    }
    function openReport(e){{/* 신고 기능 */}
        const id = e.target.dataset.id;
        const userid = e.target.dataset.userid;
        const content = e.target.dataset.content;
        setReport({
            report_tblname: 3,
            report_tbluuid:  id,
            reported_userid: userid,
            report_content: content,// 피신고자의 채팅 내용
        })
        toggleReport();
    }
    function toggleReport(){{/* 신고 기능 */}
        setReportShow(!reportShow);
    }
    function reportFormAdd(event){
        let idField = event.target.name;
        let idValue = event.target.value;
        
        setReport(p=>{return {...p, [idField]:idValue}});
    }
    async function submitReport(e){{/* 신고 기능 */}
        e.preventDefault();
        const result = await axios.post("http://localhost:9988/report/submit", report, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if(result.status==200){
            toggleReport();
          }
    }
    return (
        <div className='container chatting_room'>
            {/* <div className='chatting_sub'>
                gdgd
            </div> */}
            {/* 신고 기능 */}
            <div className={`report_window ${reportShow ? 'report_show':'report_hide'}`}>
                            <div className='report_close' onClick={toggleReport}></div>
                            <form className="chatting_report" onSubmit={submitReport}>
                                    <div className="title" >
                                        <h2>신고하기</h2>
                                        <div>
                                            <input type="radio" name="report_type" value='0' onChange={reportFormAdd} /><span>욕설</span>
                                            <input type="radio" name="report_type" value='1' onChange={reportFormAdd}/><span>스포일러</span>
                                            <input type="radio" name="report_type" value='2' onChange={reportFormAdd}/><span>비매너 행위</span>
                                            <input type="radio" name="report_type" value='3' onChange={reportFormAdd}/><span>기타</span>
                                        </div>
                                    </div>
                                    <div className="sub_title">
                                    <h2>상세내용</h2>
                                    <textarea name="report_reason" onChange={reportFormAdd}>

                                    </textarea>
                                    </div>
                                    <button type="submit">방만들기</button>
                                </form>
                        </div> 
            <div className='chatting_box'>
                <h1>MQTT Chat Application</h1>
                <div className='chatting_list' ref={chatting_box}> 
                    {receivedMessages.map((data, index) => (
                        <>  
                        
                        {
                            
                            {
                                0: <div class="chatting_day">{new Date(data.chat_date).toLocaleDateString('ko-KR', options).replace(/ /g, '')}</div>,
                                1:  
                                    myid==data.userid?
                                    <div className='myText'>
                                        <div className='chat_text_box'>
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
                                    <div className='anotherText' data-id={index}>
                                        <div className='chat_profile'><img  src={`${data.userprofile}`}/></div>
                                        <div>
                                            <div className='chat_usernick'>{data.usernick}</div>
                                            <div className='chat_info' >
                                                <div className='chat_text'>
                                                    {data.chat_content}
                                                </div>
                                                <div className='chat_sub_info'>
                                                    <div className='chat_date'>
                                                    {(data.chat_date).substring(11, 16)}
                                                    </div>
                                                    {/* <div className='chat_read'>
                                                        1
                                                    </div> */}
                                                    <div className='chat_report' >
                                                        <AiOutlineAlert size="25px" data-id={data.content_id} data-userid={data.userid} data-content={data.chat_content} onClick={openReport} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    ,
                                2:  <div className='doorway'>{data.usernick} 님이 입장 하였습니다.</div>,
                                3:  <div className='doorway'>{data.usernick} 님이 퇴장 하였습니다.</div>,
                            }[data.chat_type]
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