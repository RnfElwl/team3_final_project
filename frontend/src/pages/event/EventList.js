import "../../css/event/EventList.css";
import React, { useState, useEffect } from 'react';
import axios from '../../component/api/axiosApi';
import { Link, useParams } from 'react-router-dom';

function EventList() {

    const [eventList, setEventList] = useState([]);
    const [noticeList, setNoticeList] = useState([]);
    const [filteredEvent, setFilteredEvent] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('');

    useEffect(() => {
        const fetchNoticeList = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/event/notice-list`);
                console.log("공지사항 데이터:", response.data);
                setNoticeList(response.data);
            } catch (error) {
                console.error("Error fetching notice list:", error);
            }
        };

        fetchNoticeList(); 
    }, []); 

    useEffect(() => {
        const fetchEventList = async () => {
            try {
                const response = await axios.get('http://localhost:9988/event/event-list');
                console.log("이벤트 데이터:", response.data);
                setEventList(response.data);
                setFilteredEvent(response.data);
            } catch (error) {
                console.error("Error fetching event list:", error);
            }
        };

        fetchEventList(); 
    }, []);

    const getEventStatus = (start_date, last_date) => {
        const now = new Date();

        const startDate = new Date(start_date);
        const lastDate = new Date(last_date);

        if (now < startDate) {
            return "준비중"; // 현재 날짜가 시작 날짜보다 이전
        } else if (now >= startDate && now <= lastDate) {
            return "진행중"; // 현재 날짜가 시작 날짜와 종료 날짜 사이
        } else {
            return "마감"; // 현재 날짜가 종료 날짜보다 이후
        }
    };

    const filterEvents = () => {
        if (!sort) return eventList; // 정렬 기준이 없으면 모든 이벤트 반환
        return eventList.filter(event => getEventStatus(event.event_startdate, event.event_lastdate) === sort);
    };

    // 선택된 정렬 기준이 변경될 때마다 필터링된 이벤트 업데이트
    useEffect(() => {
        setFilteredEvent(filterEvents());
    }, [sort, eventList]);

    const getStatusClass = (status) => {
        switch (status) {
            case "준비중":
                return "status preparing"; // 준비중일 때
            case "진행중":
                return "status ongoing"; // 진행중일 때
            case "마감":
                return "status closed"; // 마감일 때
            default:
                return "status"; // 기본 클래스
        }
    };
    const currentStatusClass = getStatusClass(sort);

    const ongoingEvents = eventList.filter(event => getEventStatus(event.event_startdate, event.event_lastdate) === "진행중");

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // 검색어 상태 업데이트

        // 검색어에 따라 필터링
        if (value.trim() === "") {
            setFilteredEvent(eventList); // 검색어가 비어있으면 모든 커뮤니티 표시
        } else {
            const filtered = eventList.filter(item => 
                item.event_title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredEvent(filtered); // 필터링된 커뮤니티 업데이트
        }
    };

    return (
        <div className="event_list">
            <div className="notice">
                {noticeList.length === 0 ? (
                    <p>공지사항이 없습니다.</p>
                ) : (
                    noticeList.map((noticeList, index) => (
                        <Link key={index} to={`/event/notice/${noticeList.notice_no}`}>
                            <div className="noticeItem">
                                <p style={{color:"red"}}>[공지]</p>
                                <p>{noticeList.notice_title}</p>
                                <p className="write_date">{noticeList.write_date}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* 이벤트 목록 영역 */}
            <p className="event_count">진행중인 이벤트: {ongoingEvents.length}건</p>
            <div className="list_top">
                <div className="search" style={{ position: 'relative', width: '60%', margin:'5px' }}>
                    <i className="fas fa-search" style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#ccc',
                        pointerEvents: 'none'
                    }}></i>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        style={{
                            paddingLeft: '40px',  // 아이콘이 겹치지 않도록 여백 추가
                            width: '100%',
                            background: '#1C1C20',
                            color: '#f0f0f0'
                        }}
                    />
                </div>
                <div className="sort">
                    <label className={sort === '' ? 'selected' : ''} onClick={() => setSort('')}> 전체
                        {/* <input type="radio" name="sort" value="all" onChange={() => setSort('')} checked={sort === ''} /> 전체 */}
                    </label>
                    <label className={sort === '진행중' ? 'selected' : ''} onClick={() => setSort('진행중')}> 진행중
                        {/* <input type="radio" name="sort" value="ongoing" onChange={() => setSort('진행중')} checked={sort === '진행중'}/> 진행중 */}
                    </label>
                    <label className={sort === '준비중' ? 'selected' : ''} onClick={() => setSort('준비중')}> 준비중
                        {/* <input type="radio" name="sort" value="preparing" onChange={() => setSort('준비중')} checked={sort === '준비중'}/> 준비중 */}
                    </label>
                    <label className={sort === '마감' ? 'selected' : ''} onClick={() => setSort('마감')}> 마감
                        {/* <input type="radio" name="sort" value="closed" onChange={() => setSort('마감')} checked={sort === '마감'}/> 마감 */}
                    </label>
                </div>
            </div>    
            <div className="eventItem">
                {filteredEvent.length === 0 ? (
                    <p style={{margin:'15px'}}>진행 중인 이벤트가 없습니다.</p>
                ) : (
                    filteredEvent.map((eventList, index) => (
                        <div className="event" key={index}>
                            <Link to={`/event/${eventList.event_no}`} >
                                <img src={eventList.event_thumnail} alt={`이벤트 ${eventList.event_title}`} className="eventImg"/>
                                <div className="event_info">
                                    <p className="event_title">{eventList.event_title}</p>
                                    <div className="bottom">
                                        <div className={getStatusClass(getEventStatus(eventList.event_startdate, eventList.event_lastdate))}>
                                            <p>{getEventStatus(eventList.event_startdate, eventList.event_lastdate)}</p>
                                        </div>
                                        <p className="status_date">{`${eventList.event_startdate} ~ ${eventList.event_lastdate}`}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                )}    
            </div>
        </div>
    );
}

export default EventList;