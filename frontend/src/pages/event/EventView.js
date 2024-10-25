import "../../css/event/EventView.css";
import React, { useState, useEffect} from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from '../../component/api/axiosApi';

function EventView() {
    const [eventView, setEventView] = useState([]);
    const { event_no } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventView = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/event/${event_no}`);
                console.log("이벤트 데이터:", response.data);
                setEventView(response.data);
            } catch (error) {
                console.error("Error fetching event view:", error);
            }
        };

    
        fetchEventView(); // 이벤트 데이터를 가져오는 함수 호출
    }, [event_no]);

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

    if (!eventView) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="event_view">
            <div className="event_top">
                <span onClick={() => navigate("/event")} className="prev">
                ⨞
                </span>
                <div className={getStatusClass(getEventStatus(eventView.event_startdate, eventView.event_lastdate))}>
                    <p>{getEventStatus(eventView.event_startdate, eventView.event_lastdate)}</p>
                </div>
                <div className="title"> 
                    <p>{eventView.event_title}</p>
                </div>
                <div className="status_date">
                    <p>{`${eventView.event_startdate} ~ ${eventView.event_lastdate}`}</p>
                </div>
            </div>
            <div className="event_img">
                <img src={eventView.event_content} alt={`이벤트 ${eventView.event_title}`} className="eventImg" />
            </div>
            <div className="event_info">
                <p>- 본 이벤트는 응모 후 취소 및 포인트 환급이 불가합니다.</p>
                <p>- 본 이벤트는 선착순으로, 상황에 따라 조기 종료될 수 있습니다.</p>
            </div>
            <div className="enter">
                <button>응모하기</button>
            </div>
        </div>

    );
}

export default EventView;