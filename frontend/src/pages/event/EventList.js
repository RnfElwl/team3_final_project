import "../../css/event/EventList.css";
import React, { useState, useEffect } from 'react';
import axios from '../../component/api/axiosApi';
import { Link, useParams } from 'react-router-dom';

function EventList() {

    const [eventList, setEventList] = useState([]);
    const [noticeList, setNoticeList] = useState([]);

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

    const ongoingEvents = eventList.filter(event => getEventStatus(event.event_startdate, event.event_lastdate) === "진행중");

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
            <div className="eventItem">
                {eventList.length === 0 ? (
                    <p>진행 중인 이벤트가 없습니다.</p>
                ) : (
                    eventList.map((eventList, index) => (
                        <div className="event" key={index}>
                            <Link key={index} to={`/event/${eventList.event_no}`} >
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