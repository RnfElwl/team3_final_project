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

    async function getEventList() {
        try{
            const {data} = await axios.get(`http://localhost:9988/admin/eventList`, {params:{
                searchKey,
                searchWord,
                searchStartDate,
                searchLastDate
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
    
    function submitData(e){
        e.preventDefault();
        getEventList();
    }


    return(
        
        <div className="noticeBody">
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
                        <option value="event_title">공지 제목</option>
                        <option value="event_writedate">작성일</option>
                        <option value="event_startdate">시작일</option>
                        <option value="event_lastdate">종료일</option>
                    </select>
                    {searchKey=='event_title' ?
                    <input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />:
                        <>
                            <input
                            type="date"
                            name="searchStartDate"
                            className="eventSearchDate"
                            onChange={handleStartDateChange}/>&nbsp;&nbsp;~
                            <input
                            type="date"
                            name="searchLastDate"
                            className="eventSearchDate"
                            onChange={handleLastDateChange}/>
                            <button type="submit">검색</button>
                        </>} 
                </form>
                {/* <button onClick={() => setIsModalOpen(true)}>공지 등록</button> */}
            </div>    
        </div>
            <table className="table table-dark table-hover AdminMovieTable">
                <tr>
                    <th>
                        <input type="checkbox"/>
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
                                // checked={checkedEvent[index]}
                                value={item?.event_no || ''}
                                // onChange={() => handleMovieChecked(index)}
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
                            <td>{item.event_active_state==1 ? "활성":"비활성"}</td>
                            <td>{item.event_editer}</td>
                            <td></td>
                            <td>{item.event_point}</td>
                            <td><button type="button"
                                        //onClick={ ()=>editBtnClick(item.movie_code)}
                                        >
                                수정하기</button></td>
                        </tr>
                       ))
                    ) : (
                        <tr className="no-results">
                            <td colSpan="13">검색한 내용을 포함한 영화가 존재하지 않습니다.</td>
                        </tr>
                    )}
                
            </table>
        </div>
    )
}

export default EveCon;