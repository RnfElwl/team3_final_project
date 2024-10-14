import "../../css/chat/chatList.css";
import { Search } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import axios from "axios";
import axios from "../../component/api/axiosApi"


function ChantList(){
    const [list, setList] = useState([]);
    const [room, setRoom] = useState(false);
    const [formData, setFormData] = useState({});
    const [tabValue, setTabValue] = useState(1);
    const [search, setSearch] = useState("");
    useEffect(() => {
        setChatList();
    }, []);
    async function setSoloChatList(){
        const {data} = await axios.get("http://localhost:9988/chat/soloChatList", {
            headers: {
              'Content-Type': 'application/json'
            },
            params:{
                keyWord: search
            }
          });
          console.log(data);
          setList(data);
    }
    async function setChatList(){
        const result = await axios.get("http://localhost:9988/chat/openChatList", {
            headers: {
              'Content-Type': 'application/json'
            },
            params:{
                keyWord: search
            }
          });
          console.log(result.data);
          setList(result.data);
    }
    function setRoomFormData(event){
        let idField = event.target.name;
        let idValue = event.target.value;
        setFormData(p=>{return {...p, [idField]:idValue}});
            
        console.log(formData);
    }
    function toggleRoom(event){
        setRoom(!room);
        setFormData(p=>{return {...p, ["chatlist_type"]:event.target.dataset.chat*1}});
    }
    async function createRoom(event){
        event.preventDefault();
        const result = await axios.post("http://localhost:9988/chat/create", formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log(result)
          if(result == 1){
            setChatList();
            setRoom(!room);
          }
    }
    function openWindow(url){
        const popupWindow = window.open(
            'http://localhost:3000/chatting/'+url, // 열고자 하는 URL
            '_blank', // 새 창으로 열기
            'width=500,height=800' // 팝업 창의 크기
          );
          popupWindow.focus();
    }
    function setSearchTitle(e){
        setSearch(e.target.value);
        
    }
    useEffect(() => {
        if(tabValue==1){
            setChatList();
        }
        else{
            setSoloChatList();
        }
    }, [search]);
    return (
        <main className="chatList">
        <div className="container">
                <form className="chat-search">
                    <input type="text" value={search} onChange={setSearchTitle}/><Search className="search_icon" size={30} />
                </form>
                {
                tabValue===1?
                <div className="chat_create"  onClick={toggleRoom} data-chat="1">
                    <div className="create">방 만들기</div>
                </div>:
                 <div className="null_create">
                </div>
                }
                <div className={`room_window ${room?'room_show':'room_hide'}`}>
                <div className="room_cancle" onClick={toggleRoom} data-chat=""></div>
                <form className="room" onSubmit={createRoom}>
                        <div className="title">
                            <h2>방 제목</h2>
                            <input type="text" name="chat_title" value={formData.chat_title} onChange={setRoomFormData}/>
                        </div>
                        {/* <div className="sub_title">
                        <h2>부제목</h2>
                        <input type="text" name="chat_content" value={formData.chat_content} onChange={setRoomFormData}/>
                        </div> */}
                        <div className="debate_img">
                            <h2>평가한 영화들</h2>
                            <input type="file" name="image_url" value={formData.chatlist_img} onChange={setRoomFormData}/>
                        </div>
                        
                        <button type="submit">오픈 채팅방 만들기</button>
                </form>
                </div>
                {/* <Link to={'chattest'}>채팅 테스트</Link> */}
                <div className={`chatList_list ${tabValue==1?'open':'solo'}`}>
                <div className="chat-tab">
                    <div className={tabValue==1 && 'tab_focus'} onClick={()=>{setChatList(); setTabValue(1);}}>오픈채팅</div>
                    <div className={tabValue==2 && 'tab_focus'} onClick={()=>{setSoloChatList(); setTabValue(2)}}>1대1채팅</div>
                </div>
                {
                    list.map(function(val, i){
                    return (
                        <>
                        {
                            tabValue==1?
                            <div className="openchat chat_box">
                        <div onClick={()=>openWindow(val.chatlist_url)}>
                        <div className="chat_box-img">
                            <img src={`http://localhost:9988/${val.image_url}`}/>
                        </div>
                        <div className="chat_box_info">
                                <div>
                                    {val.chat_title}
                                </div>
                                <div>{val.usernick}</div>
                            </div>

                        </div>
                        <div>
                        </div>
                        </div>
                        :
                        <>
                        <div className="solochat chat_box">
                            <div onClick={()=>openWindow(val.chatlist_url)}>
                                <div className="chat_box-img">
                                    <img src={`http://localhost:9988/${val.image_url}`}/>
                                </div>
                                <div className="chat_box_info">
                                    <div>
                                        {val.usernick}
                                    </div>
                                    <div className="sub_content">
                                        {val.chat_content}
                                    </div>
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                        <div className="solochat chat_box">
                        <div onClick={()=>openWindow(val.chatlist_url)}>
                            <div className="chat_box-img">
                                <img src={`http://localhost:9988/${val.image_url}`}/>
                            </div>
                            <div className="chat_box_info">
                                <div>
                                    {val.usernick}
                                </div>
                                <div>
                                    {val.chat_content}
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className="solochat chat_box">
                    <div onClick={()=>openWindow(val.chatlist_url)}>
                        <div className="chat_box-img">
                            <img src={`http://localhost:9988/${val.image_url}`}/>
                        </div>
                        <div className="chat_box_info">
                            <div>
                                {val.usernick}
                            </div>
                            <div>
                                        {val.chat_content}
                                    </div>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <div className="solochat chat_box">
                            <div onClick={()=>openWindow(val.chatlist_url)}>
                                <div className="chat_box-img">
                                    <img src={`http://localhost:9988/${val.image_url}`}/>
                                </div>
                                <div className="chat_box_info">
                                    <div>
                                        {val.usernick}
                                    </div>
                                    <div>
                                        {val.chat_content}
                                    </div>
                                </div>
                            </div>
                            <div>
                            </div>
                        </div>
                </>
                        }
                    </>
                )
                })
            }
            </div>
        </div>
        </main>
    );
}

export default ChantList;