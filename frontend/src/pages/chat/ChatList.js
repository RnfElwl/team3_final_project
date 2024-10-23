import "../../css/chat/chatList.css";
import { Search } from 'react-bootstrap-icons';
import { useState, useEffect, useRef  } from 'react';
import { BsExclamationCircle } from "react-icons/bs";
import { useNavigate  } from 'react-router-dom';
//import axios from "axios";
import axios from "../../component/api/axiosApi"


function ChantList(){
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const [list, setList] = useState([]);
    const [room, setRoom] = useState(false);
    const [formData, setFormData] = useState({});
    const [tabValue, setTabValue] = useState(1);
    const [reviewList, setReviewList] = useState([]);
    const [clickMovie, setClickMovie] = useState(null);
    const [search, setSearch] = useState("");
    const [reviewSearch, setReviewSearch] = useState("");
    useEffect(() => {
        setChatList();
        window.navigateToPage = (path) => {
            navigateRef.current(path); // 경로 이동
          };
    }, []);
    async function setSoloChatList(){
        try{

           
        const {data} = await axios.get("http://localhost:9988/chat/soloChatList", {
            headers: {
              'Content-Type': 'application/json'
            },
            params:{
                keyWord: search
            }
          });
          setList(data);
        }catch(e){
            console.log(e)
        }     
    }
    async function setChatList(){
        try{
        const result = await axios.get("http://localhost:9988/chat/openChatList", {
            headers: {
              'Content-Type': 'application/json'
            },
            params:{
                keyWord: search
            }
          });
          setList(result.data);
        }catch(e){
            console.log(e)
        }    
    }
    function setRoomFormData(event){
        let idField = event.target.name;
        let idValue = event.target.value;
        setFormData(p=>{return {...p, [idField]:idValue}});
            
        console.log(formData);
    }
    function toggleRoom(){
        setRoom(!room);
        setFormData(p=>{return {...p, ["chatlist_type"]:1}});
        if(!room==false){
            setClickMovie(null);
            setFormData(p=>{return {...p, ['chat_title']:""}});
        }
        
    }
    async function reviewDefault(){
        try{
        const {data} = await axios.get("http://localhost:9988/chat/review-list", {
            params:{
                keyWord: reviewSearch
            }
        });
        setReviewList(data);
        console.log(data);
        }
        catch(e){
            console.log(e);
        }
    }
    async function createRoom(event){
        event.preventDefault();
        try{
        const result = await axios.post("http://localhost:9988/chat/create", formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          toggleRoom();
          console.log(result);
          if(result.status == 200){
            setChatList();
            setRoom(!room);
          }
        }
        catch(e){
            console.log(e);
        }
    }
    function openWindow(url){
        const popupWindow = window.open(
            '/chatting/'+url, // 열고자 하는 URL
            '_blank', // 새 창으로 열기
            'width=500,height=800' // 팝업 창의 크기
          );
          popupWindow.focus();
    }
    function setSearchTitle(e){
        setSearch(e.target.value);
    }
    function setReviewTitle(e){
        setReviewSearch(e.target.value);
    }
    async function setMovieData(movie_no, movie_code, movie_img_url, movie_title){
        const data={
            movie_no, movie_code, movie_img_url, movie_title
        }
        setFormData(p=>{return {...p, ...data}});
    }
    useEffect(() => {
        if(tabValue==1){
            reviewDefault();
            setChatList();
        }
        else{
            setSoloChatList();
        }
    }, [search]);

    useEffect(()=>{
        reviewDefault();
    }, [reviewSearch])
    return (
        <main className="chatList">
        <div className="container">
                <form className="chat-search">
                    <input type="text" value={search} onChange={setSearchTitle}/><Search className="search_icon" size={30} />
                </form>
                {
                tabValue===1?
                <div className="chat_create"  onClick={toggleRoom}>
                    <div className="create">방 만들기</div>
                </div>:
                 <div className="null_create">
                </div>
                }
                <div className={`room_window ${room?'room_show':'room_hide'}`}>
                <div className="room_cancle" onClick={toggleRoom}></div>
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
                            <h4>내가 리뷰한 영화</h4>
                            <form className="chat-search">
                                <input type="text" value={reviewSearch} onChange={setReviewTitle}/><Search className="search_icon" size={30} />
                            </form>
                            <div className="movie_list">
                                {
                                    reviewList.length==0?<>
                                    <div className="list_notice">
                                        <BsExclamationCircle/>
                                        <div>리뷰한 영화가 없거나 찾을수 없습니다.</div>
                                    </div>
                                    </>:
                                    reviewList.map((data, i)=>(
                                        <div className={`movie_box ${clickMovie==data.movie_no?'focus':''}`}>
                                            <div className="movie_img">
                                                <img onClick={()=>{setMovieData(data.movie_no, data.movie_code, data.movie_img_url, data.movie_title); setClickMovie(data.movie_no)}} src={`${data.movie_img_url}`} />
                                            </div>
                                            <div className="movie_title">
                                                {data.movie_title}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        
                        <button type="submit" disabled={clickMovie==null}>오픈 채팅방 만들기</button>
                </form>
                </div>
                {/* <Link to={'chattest'}>채팅 테스트</Link> */}
                <div className={`chatList_list ${tabValue==1?'open':'solo'}`}>
                <div className="chat-tab">
                    <div className={tabValue==1 && 'tab_focus'} onClick={()=>{setChatList();setList([]); setTabValue(1); }}>오픈채팅</div>
                    <div className={tabValue==2 && 'tab_focus'} onClick={()=>{setSoloChatList();setList([]); setTabValue(2);}}>1대1채팅</div>
                </div>
                {
                        list.length==0&&(
                            <>
                                <div className="list_notice">
                                    <BsExclamationCircle/>
                                    <div>채팅방이 없거나 찾을 수 없습니다.</div>
                                </div>
                            </>
                        )
                    }
                {
                    
                    list.map(function(val, i){
                    return (
                        <>
                        {
                            tabValue==1?
                            <div className="openchat chat_box">
                        <div onClick={()=>openWindow(val.chatlist_url)}>
                        <div className="chat_box-img">
                            <img src={val.movie_img_url}/>
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