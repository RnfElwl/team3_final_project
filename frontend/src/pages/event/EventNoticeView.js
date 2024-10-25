import "../../css/event/EventList.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventNoticeView() {
    const [announcements, setAnnouncements] = useState([]); // 공지사항 상태
    const [events, setEvents] = useState([]); // 이벤트 상태

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 공지사항과 이벤트 데이터 가져오기
                // const announcementsResponse = await axios.get('http://localhost:3000/event/notice');
                // const eventsResponse = await axios.get('http://localhost:3000/event/events');
                
                // setAnnouncements(announcementsResponse.data);
                // setEvents(eventsResponse.data);
            } catch (error) {
                console.error("데이터를 가져오는 데 오류가 발생했습니다.", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="event_list">
            <div className="notice">
                {announcements.map((announcement, index) => (
                    <div key={index}>
                        <strong>[공지]</strong> {announcement}
                    </div>
                ))}
            </div>
            <div className="eventItem">
                {events.map((event, index) => (
                    <div key={index} className="event">
                        <img src={event.imageUrl} alt={`이벤트 ${index + 1}`} className="eventImg"/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventNoticeView;