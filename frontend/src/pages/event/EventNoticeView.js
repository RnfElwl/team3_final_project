import "../../css/event/EventList.css";
import React, { useState, useEffect } from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import { MdAccessTime } from "react-icons/md";
import '../../css/event/EventNotice.css';
import HideEventMove from '../../component/HideEventMove';

function EventNoticeView() {
    const [noticeData, setNoticeData] = useState({}); // 공지사항 상태
    const {notice_no} = useParams();
    const options = {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true // 12시간 형식
      };
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 공지사항과 이벤트 데이터 가져오기
                const {data} = await axios.get(`http://localhost:9988/event/notice/${notice_no}`);
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
        <div className="event_notice">
            <div className="notice_box">
                <div className="notice_alrt">
                <h1>공지사항</h1>
                <Link className="list_btn" to="/event">목록</Link>
                </div>
                <h2 className="notice_title"><div className="notice_icon">공지</div>{noticeData.notice_title}</h2>
                <div className="notice_date">{((new Date(noticeData.write_date)).toLocaleDateString('ko-KR', options)).substring(0, 12)}<MdAccessTime/>{((new Date(noticeData.write_date)).toLocaleDateString('ko-KR', options)).substring(13)}</div>
                <pre className="notice_content">
                    {noticeData.notice_content}
                </pre>
            </div>
            <HideEventMove/>
        </div>
    );
}

export default EventNoticeView;