import React, { useEffect, useState, useRef } from 'react';
import "../../css/chat/chtting.css";
import axios from '../../component/api/axiosApi.js';
import mqtt from 'mqtt';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineAlert } from "react-icons/ai";
import { IoPerson, IoExitOutline, IoCloseSharp  } from "react-icons/io5";
import { FaCalendarCheck } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import ReportModal from '../../component/api/ReportModal.js';
const Chatting = () => {
    const date = new Date(); // 현재 날짜
    const options = {
        year: 'numeric',
        month: 'long', // 'short' 또는 '2-digit'으로 변경 가능
        day: 'numeric',
        weekday: 'long' // 요일
    };
    const {chatlist_url } = useParams();// 채팅방 id 
    const [roomInfo, setRoomInfo]= useState({}); // 채팅방 정보 
    const [client, setClient] = useState(null);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [messageToSend, setMessageToSend] = useState('');
    const [isConnected, setIsConnected] = useState(false); // 연결 상태 확인용
    const [userData, setUserData] = useState({});
    const [myid, setMyid] = useState("");
    const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
    const [report, setReport] = useState({});//신고 폼에 있는 값들어있음
    const [menu, setMenu] = useState(false);// 메뉴 태그 보일지 말지
    const [userList, setUserList] = useState(false);//유저 리스트 태그 보일지 말지
    const [memberList, setMemberList] = useState([]);// 채팅방 유저 정보 담는곳
    const [scheduleShow, setScheduleShow] = useState(false);
    const [scheduleCreate, setScheduleCreate] = useState(false);
    const [today, setToday] = useState(new Date());
    const [scheduleForm, setScheduleForm] = useState({chatlist_url});
    const [scheduleList, setScheduleList] = useState([]);// 일정 리스트 
    const [newTag, setNewTag] = useState([]);
    const [oldTag, setOldTag] = useState([]);
    let once = 0;
    const chatting_box = useRef(null);
    const menu_box = useRef(null);
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        if(once == 0){
            once = 1;
            setDefaultChat();
            setDefaultMember();
            setDefaultSchdule();
        }
        const mqttClient = mqtt.connect('ws://localhost:8083'); // 브로커의 WebSocket 포트로 연결
        getUser()
        getRoomInfo();
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
      async function getRoomInfo(){
        const result = await axios.get(`http://localhost:9988/chat/roominfo`, {params: {
            chatlist_url
        }});
        console.log(result);
        setRoomInfo(result.data);
      }
      async function dateMsgSend(){// 로컬 날짜 메시지 출력
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
                const box = [info, receivedMessages[0]];
                setReceivedMessages(box)
                return ;
            }
            const lastDay = (receivedMessages[receivedMessages.length -2].chat_date).substring(0, 10);
            if(lastDay!=now.substring(0, 10)){
                const box = receivedMessages.slice(0, receivedMessages.length-1)
                const lastBox = receivedMessages[receivedMessages.length-1]
                box.push(info);
                box.push(lastBox)
                setReceivedMessages(box)
            }
        }
    }
    
    async function setDefaultChat(){ // 채팅 기본 값 세팅
        const {data} = await axios.get(`http://localhost:9988/chat/${chatlist_url}`);
        
        setReceivedMessages(data);
        
    }

    async function setDefaultSchdule(){
        const {data} = await axios.get("http://localhost:9988/chat/schedule/list", {params:{chatlist_url}});
        console.log(data);
        setScheduleList(data);
    }
    async function setDefaultMember(){
        const {data} = await axios.get(`http://localhost:9988/chat/member-list`, {params:{
            chatlist_url
        }});
        console.log(data);
        setMemberList(data);
    }
    
    async function getUser(){// 자기 정보 가져오기
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
                console.log(data, typeof(data), data == 1)
                const result3 = await axios.post("http://localhost:9988/chat/headcount", chatlist_url, {
                    headers: {
                      'Content-Type': 'text/plain', // 전송할 데이터의 타입을 명시적으로 'text/plain'으로 설정
                    }
                  });
                if(result3.data == 1){
                    getRoomInfo();
                }
                setReceivedMessages(receivedMessages)
                
                mqttClient.publish(`test/topic/${chatlist_url}`, JSON.stringify(info));
            }
        }
    }
    useEffect(() => {
        // 매초마다 실행되는 함수
        const interval = setInterval(() => {
          console.log("Current value:", today); // 변수 확인
          setToday(new Date());
          console.log(today);
        }, 1000); // 1000ms = 1초
    
        // 컴포넌트가 언마운트될 때 setInterval을 정리
        return () => clearInterval(interval);
      }, [today]); // `value`가 변경될 때마다 이 effect가 실행됨
    
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
    function userToggle(){
        setUserList(!userList);
        setMenu(false)
    }

    function menuToggle(){
        setMenu(!menu);
        setUserList(false)
    }
    function scheduleToggle(){
        setMenu(false);
        setScheduleShow(!scheduleShow);
    }
    async function scheduleCreateSubmit(e){
        e.preventDefault();
        const result = await axios.post("http://localhost:9988/chat/schedule/create", scheduleForm);
        console.log(scheduleForm);
        setScheduleCreate(false);

    }
    function scheduleFormAdd(event){
        let idField = event.target.name;
        let idValue = event.target.value;
        setScheduleForm(p=>{return {...p, [idField]:idValue}});
    }
    function schedule_list_tag(){
        scheduleList.map((data, index)=>{

            if((new Date(data.schedule_date).getTime() -  today.getTime())>=0){
                setNewTag(p=>[...p, <div className='schedule'>최신
                    <div className='schedule_icon'><FaCalendarCheck size="20px"/></div>
                    <div className='schedule_info'>
                        <div className='schedule_title'>{data.schedule_title}</div>
                        <div className='schedule_member'><IoPerson size="15px" ></IoPerson >2 [참여] {(data.schedule_date).substring(0, 16)}</div>
                        <div className='schedule_date'>{(data.schedule_date).substring(0, 16)}</div>
                        <div className='schedule_addr'>{data.schedule_addr}</div>
                    </div>
                    <div className='schedule_voting'>
                        <div>참여</div>
                        <div>불참</div>
                    </div>
                </div>])
            }
            else{
                setOldTag(p=>[...p, <div className='schedule'>과거
                    <div className='schedule_icon'><FaCalendarCheck size="20px"/></div>
                    <div className='schedule_info'>
                        <div className='schedule_title'>{data.schedule_title}</div>
                        <div className='schedule_member'><IoPerson size="15px" ></IoPerson >2 [참여] {(data.schedule_date).substring(0, 16)}</div>
                        <div className='schedule_date'>{(data.schedule_date).substring(0, 16)}</div>
                        <div className='schedule_addr'>{data.schedule_addr}</div>
                    </div>
                    <div className='schedule_voting'>
                    </div>
                </div>])
            }
        })
    }
    return (
        <div className='chatting_room'>
            <header className='chat_header'> 
                <div className='room_info'>
                    <div className='room_title'>{roomInfo.chat_title}</div>
                    <div className='user_count' title="유저 목록" onClick={userToggle}>
                        <div>
                        <IoPerson size="15px" ></IoPerson >{roomInfo.chatlist_headcount}
                        </div>
                        <div className={`user_list ${userList?'user_show':'user_hide'}`}>
                            {
                            memberList.map((data, index)=>(
                                <>
                                    <div>
                                        <div><img src={`${data.userprofile}`}/></div>
                                        <div>{data.usernick}</div>
                                    </div>
                                </>
                            ))
                            }
                        </div>
                    </div>
                </div>
                <div className='schedule_icon'>
                    <div onClick={menuToggle} className={`${scheduleShow?'schedule_hide':'schedule_show'}`}>
                        <GiHamburgerMenu size="30px"/>
                    </div>
                    <div className={`${scheduleShow?'schedule_show':'schedule_hide'}`} onClick={()=>setScheduleShow(false)}>
                        <IoCloseSharp size="40px"/>
                    </div>
                    <div className={`menu_list ${menu?'menu_show':'menu_hide'}`} ref={menu_box}>
                        <div onClick={scheduleToggle}>
                            <FaCalendarCheck />일정
                        </div>
                        <div>
                            <IoExitOutline/> 방나가기
                        </div>
                    </div>
                </div>
            </header>
            <header>
                공간 차지하는 용도
            </header>

            {/* 신고 기능 */}
            <ReportModal    
                reportShow={reportShow}// 모달창 보이기 여부
                toggleReport={toggleReport} // 모달창 열고닫기 함수
                report={report}// 신고 데이터 변수
                setReport={setReport} // 신고 데이터 변수 세팅
            />
            <div className={`schedule_create ${scheduleCreate?'schedule_create_show':'schedule_create_hide'}`}>
                <div className='schedule_create_close' onClick={()=>setScheduleCreate(false)}></div>
                <form className='schedule_create_form' onSubmit={scheduleCreateSubmit}>
                    <h2>일정 만들기</h2>
                    <div>
                        제목 <input type="text" name="schedule_title" onChange={scheduleFormAdd}/>
                        날짜 <input type='date' name="day" onChange={scheduleFormAdd}/>
                        시간 <input type="time" name="time" onChange={scheduleFormAdd}/>
                        설명 <input tpye="text" name="schedule_addr" onChange={scheduleFormAdd}/>
                    </div>
                    <button type='submit'>일정 생성</button>
                </form>
            </div>

            <div  className={`schedule_box ${scheduleShow?'schedule_show':'schedule_hide'}`}
                onClick={()=>{ setMenu(false); setUserList(false)}} >
                
                <div className='schedule_btn' onClick={()=>setScheduleCreate(true)}>
                    일정 만들기
                </div>
                <div className='schedule_list'>
                    <div>최신</div>
                {
                    scheduleList.map((data, index)=>(
                            <>
                            {(new Date(data.schedule_date).getTime() -  today.getTime())>=0?(
                            <div className='schedule'>최신
                                <div className='schedule_icon'><FaCalendarCheck size="20px"/></div>
                                <div className='schedule_info'>
                                    <div className='schedule_title'>{data.schedule_title}</div>
                                    <div className='schedule_member'><IoPerson size="15px" ></IoPerson >2 [참여] {(data.schedule_date).substring(0, 16)}</div>
                                    <div className='schedule_date'>{(data.schedule_date).substring(0, 16)}</div>
                                    <div className='schedule_addr'>{data.schedule_addr}</div>
                                </div>
                                <div className='schedule_voting'>
                                    <div>참여</div>
                                    <div>불참</div>
                                </div>
                            </div>
                            ):
                            (
                            <div className='schedule'>과거
                                <div className='schedule_icon'><FaCalendarCheck size="20px"/></div>
                                <div className='schedule_info'>
                                    <div className='schedule_title'>{data.schedule_title}</div>
                                    <div className='schedule_member'><IoPerson size="15px" ></IoPerson >2 [참여] {(data.schedule_date).substring(0, 16)}</div>
                                    <div className='schedule_date'>{(data.schedule_date).substring(0, 16)}</div>
                                    <div className='schedule_addr'>{data.schedule_addr}</div>
                                </div>
                                <div className='schedule_voting'>
                                </div>
                            </div>)
                                }
                            </>

                    ))
                    }
</div>
                <div className='schedule_list'>
                    <div>현재 일정</div>
                    <div className='schedule'>
                        <div className='schedule_icon'><FaCalendarCheck size="20px"/></div>
                        <div className='schedule_info'>
                            <div className='schedule_title'>베테랑 같이 볼사람</div>
                            <div className='schedule_member'><IoPerson size="15px" ></IoPerson >2 [참여] 2024-10-20 14:30</div>
                            <div className='schedule_date'>2024-10-20 14:30</div>
                            <div className='schedule_addr'>안만나고 여기 사이트에서 각자 보죠</div>
                        </div>
                        <div className='schedule_voting'>
                            <div>참여</div>
                            <div>불참</div>
                        </div>
                    </div>
                </div>
                <div className='schedule_list'>
                    <div>과거 일정</div>
                </div>
            </div>
            
            <div className='chatting_box' onClick={()=>{ setMenu(false); setUserList(false)}}>
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