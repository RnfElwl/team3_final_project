import "../../css/event/EventList.css";
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import axios from '../../component/api/axiosApi';

function EventNoticeView() {
    const [noticeData, setNoticeData] = useState({}); // 공지사항 상태
    const {notice_no} = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 공지사항과 이벤트 데이터 가져오기
                const {data} = await axios.get(`http://localhost:3000/event/notice/${notice_no}`);
                console.log(data);
                
                setNoticeData(data);
                // setEvents(eventsResponse.data);
            } catch (error) {
                console.error("데이터를 가져오는 데 오류가 발생했습니다.", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="event_list">

        </div>
    );
}

export default EventNoticeView;