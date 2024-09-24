import "../../css/chat/chatList.css";
import { Search } from 'react-bootstrap-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';


function ChantList(){
    const [list, setList] = useState([1,3,4,5,6]);
    return (
        <div className="container chatList">
                <div className="chat-search"><input type="text"/><Search size={30}/></div>
                <div className="chat-tab">
                    <div>오픈채팅</div>
                    <div>1대1채팅</div>
                    <div>토론방</div>
                </div>
                <div><Link to={'chattest'}>채팅 테스트</Link></div>
                <div className="chatList_list">
                {
                    list.map(function(val, i){

                    console.log(i);
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
    );
}

export default ChantList;