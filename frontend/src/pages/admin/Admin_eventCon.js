import './../../css/admin/adminEventCon.css'

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsExclamationCircle } from "react-icons/bs";
import axios from '../../component/api/axiosApi';
import Modal from '../../component/api/Modal';

function EveCon(){
    const [event, setEvent]=useState([]);
    const [searchKey, setSearchKey]=useState('event_title');
    const [searchWord, setSearchWord]=useState('');
    const [searchStartDate, setSearchStartDate]=useState('');
    const [searchLastDate,setSearchLastDate]=useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [writeForm, setWriteForm] = useState({});
    const [editForm, setEditForm] = useState({});
    const [checkedEvent, setCheckedEvent] = useState(new Array(event.length).fill(false));
    const [editActive_state, setEditActive_state] = useState('1');
    const [isAllEventChecked, setAllEventChecked] = useState(false);
    const [eventMem, setEventMem]=useState([]);
    const [visibleEvent, setVisibleEvent] = useState(null);



    const handleAllEventChecked = () => {
        const newCheckedState = !isAllEventChecked;
        setAllEventChecked(newCheckedState);
        setCheckedEvent(new Array(event.length).fill(newCheckedState));  
      };

      const handleEventChecked = (index) => {
        const newCheckedEvent = [...checkedEvent];
        newCheckedEvent[index] = !newCheckedEvent[index]; // 해당 항목의 체크 상태 변경
        setCheckedEvent(newCheckedEvent);

        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllEventChecked(newCheckedEvent.every(item => item === true));
    }; 

    const handleActive_StateChange=(e)=>{
        setEditActive_state(e.target.value);
    }

    const editActiveStateSubmit = (e) => {
        e.preventDefault();

        const formData =new FormData();

        checkedEvent.forEach((isChecked, index) => {
            if (isChecked) {
                console.log(index);
                const event_no = event[index]?.event_no; // 체크된 항목의 qna_no를 가져옵니다.
                if (event_no) {
                    formData.append('event_no', event_no); // qna_no를 폼 데이터에 추가합니다.           
                }
            }
        });

        formData.append('event_active_state',editActive_state);

        formData.forEach((value, key) => {
            console.log("키:",key,"값: "+value);
        });

        axios.post('http://localhost:9988/admin/eventActiveEdit', formData)
            .then(response => {
                console.log('성공:', response.data); 
                if (response.data >= 1) {
                    getEventList();
                }
            })
            .catch(error => {
                console.error('오류 발생:', error);
            });
      }
        
        

    const handlesearchKeyChange = (e) => { //검색키 처리
        console.log(e.target.value)
        setSearchKey(e.target.value);
    };
      const handlesearchWordChange = (e) => { //검색키 처리
        console.log(e.target.value)
        setSearchWord(e.target.value);
    };
    const handleStartDateChange=(e)=>{
        console.log("시작:"+e.target.value)
        setSearchStartDate(e.target.value);
    }
    const handleLastDateChange=(e)=>{
        console.log("끝:"+e.target.value)
        setSearchStartDate(e.target.value);
    }

    async function editBtnClick(no) {
        try {
          const response = await axios.get(`http://localhost:9988/admin/event/${no}`);
          
          if (response.data) {
              setEditForm(response.data[0]); // 데이터를 editForm에 세팅
              setIsEditModalOpen(true);
          }
        } catch (e) {
            console.log(e);
        }
      }

    async function getEventList() {
        try{
            const {data} = await axios.get(`http://localhost:9988/admin/eventList`, {params:{
                searchKey,
                searchWord
            }});
            console.log(data);
            setEvent(data);
        }catch(e){
            console.log(e);
        }
    }
    useEffect(()=>{
        getEventList();
    }, []);
    
    //서치폼
    function submitData(e){
        e.preventDefault();
        getEventList();
    }


    //등록폼 핸들
    function changeWriteForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setWriteForm((p)=>{return {...p, [idField]:idValue}});
        console.log(writeForm);
    }
    function changeEditForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setEditForm((p)=>{return {...p, [idField]:idValue}});
        console.log(editForm);
    }

    //등록폼
    async function event_WriteForm(e){
        e.preventDefault();
        console.log(writeForm)
        if(!writeForm.event_title){
            window.alert("제목이 공백입니다.")
            return false;
        }
        if(!writeForm.event_content){
            window.alert("내용이 공백입니다.")
            return false;
        }
        if(!writeForm.event_thumnail){
            window.alert("썸네일이 공백입니다.")
            return false;
        }
        if(writeForm.event_startdate>writeForm.event_lastdate){
            window.alert("시작일이 종료일 이후입니다.")
            return false;
        }
        try{
            const {data} = await axios.post("http://localhost:9988/admin/event/write", writeForm ,{
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            if(data===1){
                setIsModalOpen(false);
                getEventList();
            }
        }catch(e){
            console.log(e);
        }
  
      }
    //수정폼
    async function event_EditForm(e){
        e.preventDefault();
        console.log(editForm)
        if(!editForm.event_title){
            window.alert("제목이 공백입니다.")
            return false;
        }
        if(!editForm.event_content){
            window.alert("내용이 공백입니다.")
            return false;
        }
        if(!editForm.event_thumnail){
            window.alert("썸네일이 공백입니다.")
            return false;
        }
        if(editForm.event_startdate>editForm.event_lastdate){
            window.alert("시작일이 종료일 이후입니다.")
            return false;
        }
        try{
            const {data} = await axios.post("http://localhost:9988/admin/event/edit", editForm ,{
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            if(data===1){
                setIsEditModalOpen(false);
                getEventList();
            }
        }catch(e){
            console.log(e);
        }
  
      }

      //참여멤버 구하기
      async function EventInMember(no) {
        try {
          const response = await axios.get(`http://localhost:9988/admin/eventInMem/${no}`);
          if (response.data) {
             console.log(response.data);
             setEventMem(response.data);
          }
        } catch (e) {
            console.log(e);
        }
      }

      const toggleEventMembers = async (event_no) => {
        if (visibleEvent === event_no) {
            setVisibleEvent(null); // 클릭한 이벤트가 열려있으면 닫기
        } else {
            setVisibleEvent(event_no); // 클릭한 이벤트 열기
            if (!eventMem[event_no]) { // 해당 이벤트 멤버가 없는 경우에만 요청
                try {
                    const response = await axios.get(`http://localhost:9988/admin/eventInMem/${event_no}`);
                    if (response.data) {
                        setEventMem((prev) => ({ ...prev, [event_no]: response.data }));
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

      

    

    return(
        
        <div className="noticeBody">
            {isModalOpen && ( 
            <Modal onClose={() => setIsModalOpen(false)} title={"이벤트 등록폼"} className="insert_form">
                    {true ? ( 
                    <form onSubmit={event_WriteForm}>
                        <div className='insert_input'>
                        <div className='eventTitle'>
                            <span>제목</span> 
                            <input type='text' name='event_title' value={writeForm.event_title} onChange={changeWriteForm}/>    
                        </div>
                        <div className='notice_content'>
                            <span>썸네일</span>
                            <input type='text' name='event_thumnail' value={writeForm.event_thumnail} onChange={changeWriteForm}/> 
                        </div>
                        <div>
                            <span>내용</span>
                            <input type='text' name='event_content' value={writeForm.event_content} onChange={changeWriteForm}/>         
                        </div>
                        <div>
                            <span>시작일</span>
                            <input type='date' name='event_startdate' value={writeForm.event_startdate} onChange={changeWriteForm}/>         
                            &nbsp;~&nbsp;
                            <span>종료일</span>
                            <input type='date' name='event_lastdate' value={writeForm.event_lastdate} onChange={changeWriteForm}/>         
                        </div>
                        <div>
                            <span>포인트</span>
                            <input type='text' name='event_point' value={writeForm.event_point} onChange={changeWriteForm}/>         
                        </div>
                        <div className="formbtns">
                            <button type="submit">등록하기</button>
                        </div>    
                        </div>
                    </form>
                    ) : (
                    <div className="noslide no-hover" style={{ height: "300px", marginTop: '20px' }}>
                        <BsExclamationCircle />
                        <p>존재하지 않는 공지 등록폼입니다.</p>
                    </div>
                    )}
                </Modal>
                )}
            {isEditModalOpen && ( 
            <Modal onClose={() => setIsEditModalOpen(false)} title={"이벤트 수정폼"} className="edit_form">
                    {true ? ( 
                    <form onSubmit={event_EditForm}>
                        <div className='edit_input'>
                        <div className='eventTitle'>
                            <span>제목</span> 
                            <input type='text' name='event_title' value={editForm.event_title} onChange={changeEditForm}/>    
                        </div>
                        <div className='notice_content'>
                            <span>썸네일</span>
                            <input type='text' name='event_thumnail' value={editForm.event_thumnail} onChange={changeEditForm}/> 
                        </div>
                        <div>
                            <span>내용</span>
                            <input type='text' name='event_content' value={editForm.event_content} onChange={changeEditForm}/>         
                        </div>
                        <div>
                            <span>시작일:</span>
                            <input type='date' name='event_startdate' value={editForm.event_startdate.slice(0, 10)} onChange={changeEditForm}/>
                            &nbsp;~&nbsp;<span>종료일:</span>
                            <input type='date' name='event_lastdate' value={editForm.event_lastdate.slice(0, 10)} onChange={changeEditForm}/>         
                        </div>
                        <div>
                            <span>포인트</span>
                            <input type='text' name='event_point' value={editForm.event_point} onChange={changeEditForm}/>         
                        </div>
                        <div className="formbtns">
                            <button type="submit">등록하기</button>
                        </div>    
                        </div>
                    </form>
                    ) : (
                    <div className="noslide no-hover" style={{ height: "300px", marginTop: '20px' }}>
                        <BsExclamationCircle />
                        <p>존재하지 않는 공지 등록폼입니다.</p>
                    </div>
                    )}
                </Modal>
                )}
            <h3>이벤트 관리</h3>
            <div className="member-filterArea">
            <div className="adminSearchForm">
                <form onSubmit={submitData}>
                    <select
                        className="MemSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}
                        >
                        <option value="event_title">이벤트 제목</option>
                        <option value="event_writedate">작성일</option>
                        <option value="event_startdate">시작일</option>
                        <option value="event_lastdate">종료일</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />
                </form>
                <button onClick={() => setIsModalOpen(true)}>공지 등록</button>
            </div>    
        </div>
        <form className="adminQnaEdit"
        onSubmit={editActiveStateSubmit}
        >
            <div className='active_box'>
                <select
                value={editActive_state}
                onChange={handleActive_StateChange}
                >
                    <option value="1">활성</option>
                    <option value="0">비활성</option>
                </select>
                <button type="submit">저장</button>
            </div>
            <table className="table table-dark table-hover AdminMovieTable">
                <tr>
                    <th>
                        <input type="checkbox"
                            checked={isAllEventChecked}
                            onChange={handleAllEventChecked} 
                        />
                    </th>
                    <th>No.</th>
                    <th>제목</th>
                    <th>썸네일</th>
                    <th>내용</th>
                    <th>작성일</th>       
                    <th>시작일</th>
                    <th>종료일</th>
                    <th>상태</th>
                    <th>수정인</th>
                    <th>접수 현황</th>
                    <th>event pt</th>
                    <th>이벤트 수정</th>
                </tr>
                {event && event.length > 0 ? (
                       event.map((item, index)=>(
                        <tr>
                            <td>
                            <input type="checkbox"
                                checked={checkedEvent[index]}
                                value={item?.event_no || ''}
                                onChange={() => handleEventChecked(index)}
                            />
                            </td>
                            <td>{item.event_no}</td>
                            <td>{item.event_title}</td>
                            <td><span onClick={() => window.open(item.event_thumnail, '_blank','width=600,height=584')}>
                                이미지 보기</span></td>
                            <td><span onClick={() => window.open(item.event_content, '_blank','width=600,height=584')}>
                            이미지 보기</span></td>
                            <td>{item.event_writedate}</td>
                            <td>{item.event_startdate}</td>
                            <td>{item.event_lastdate}</td>
                            <td>{item.event_active_state==1 ? "활성":
                                 item.event_active_state==2? "수정됨":"비활성"}</td>
                            <td>{item.event_editer}</td>
                            <td>
                                {item.user_count}
                                <div onClick={() => toggleEventMembers(item.event_no)} style={{ cursor: "pointer" }}>
                                    목록확인
                                    {visibleEvent === item.event_no && eventMem[item.event_no] ? (
                                        <div className="member-list">
                                            {eventMem[item.event_no].map((member, idx) => (
                                                <span key={idx} className="member-item">{member.userid}</span>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </td>
                            <td>{item.event_point}</td>
                            <td><button type="button" onClick={ ()=>editBtnClick(item.event_no)}>
                                수정하기</button></td>
                        </tr>
                       ))
                    ) : (
                        <tr className="no-results">
                            <td colSpan="13">검색한 내용을 포함한 이벤트가 존재하지 않습니다.</td>
                        </tr>
                    )}
                
            </table>
            </form>
        </div>
    )
}

export default EveCon;