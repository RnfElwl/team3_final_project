import "../../css/chat/chatList.css";
import { Search } from 'react-bootstrap-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";


function ChantList(){
    const [list, setList] = useState([1,3,4,5,6]);
    const [menu, setMenu] = useState(false);
    const [room, setRoom] = useState(false);
    const [createType, setCreateType] = useState();
    const [formData, setFormData] = useState({});

    function setRoomFormData(event){
        let idField = event.target.name;
        let idValue = event.target.value;

        setFormData(p=>{return {...p, [idField]:idValue}});
            
        console.log(formData);
    }
    function toggleMenu(){
        setMenu(!menu);
    }
    function toggleRoom(event){
        setRoom(!room);
        setFormData(p=>{return {...p, ["chatlist_type"]:event.target.dataset.chat*1}});
    }
    async function createRoom(event){
        event.preventDefault();
        
        console.log(formData);
        const result = await axios.post("http://localhost:9988/chat/create", formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
    }
    return (
        <main className="chatList">

        
        <div className="container">
                <div className="chat-search"><input type="text"/><Search size={30}/></div>
                <div className="chat-tab">
                    <div>오픈채팅</div>
                    <div>1대1채팅</div>
                    <div>토론방</div>
                </div>
                <div className="chat_create"  onClick={toggleMenu}>
                    <div className="create">방만들기</div>
                    <div className={`room_menu ${menu?'menu_show':'menu_hide'}`}>
                        <div onClick={toggleRoom} data-chat="1">오픈 채팅</div>
                        <div onClick={toggleRoom} data-chat="2">1대1채팅</div>
                        <div onClick={toggleRoom} data-chat="3">토론방</div>
                    </div>
                </div>
                <div className={`room_window ${room?'room_show':'room_hide'}`}>
                <div className="room_cancle" onClick={toggleRoom} data-chat=""></div>
                <form className="room" onSubmit={createRoom}>
                        <div className="title" >
                            <h2>방 제목</h2>
                            <input type="text" name="chat_title" value={formData.chat_title} onChange={setRoomFormData}/>
                        </div>
                        <div className="sub_title">
                        <h2>부제목</h2>
                        <input type="text" name="chat_content" value={formData.chat_content} onChange={setRoomFormData}/>
                        </div>
                        {
                            formData.chatlist_type==3 && 
                                <div className="debate_img">
                                    <h2>내가 보고 평가한 영화들</h2>
                                    <input type="text" name="chat_content" value={formData.chatlist_img} onChange={setRoomFormData}/>
                                </div>
                        }
                        <button type="submit">방만들기</button>
                </form>
                </div>
                {/* <Link to={'chattest'}>채팅 테스트</Link> */}
                <div className="chatList_list">
                {
                    list.map(function(val, i){
                    return (<div className="openchat chat_box">
                        <div className="chat_box-img">
                            <img src=""/>
                        </div>
                        <div>{i}</div>
                    </div>)
                })
            }
            </div>
        </div>
        </main>
    );
}

export default ChantList;