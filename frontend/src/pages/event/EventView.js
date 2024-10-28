import "../../css/event/EventView.css";
import React, { useState, useEffect} from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from '../../component/api/axiosApi';

function EventView() {
    const [eventView, setEventView] = useState([]);
    const { event_no } = useParams();
    const [userid, setUserid] = useState();
    const [status, setStatus] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                setUserid(response.data);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
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
    async function clickSubmitEvent(){
        if(!userid){
            alert("로그인후 이용 가능합니다");
            return 0;
        }
        try{

            const result = await axios.get("http://localhost:9988/event/ten/check", {params:{event_no}})
            if(result.data===1){
                setStatus("마감")
                alert("마감되었습니다.");
                return;
            }
            const result2 = await axios.get("http://localhost:9988/event/user/check", {params:{event_no}})
            if(result2.data===1){
                alert("이미 응모한 이벤트 입니다.");
                return;
            }
            const event_point = eventView.event_point;
            
            const {data} = await axios.post("http://localhost:9988/event/point/minus", {event_no:Number(event_no), event_point});
            if(data===1){
                alert("성공적으로 응모 되었습니다.")
            }
            else{
                alert("포인트가 부족합니다.")
            }
            console.log(data);
        }catch(e){
            console.log(e);
        }
    }

    // useEffect(() => {
    //     axios.get('http://localhost:9988/user/userinfo')
    //         .then(response => {
    //             setUserid(response.data.userid);
    //         })
    //         .catch(error => {
    //             console.error("데이터 로드 중 오류 발생:", error);
    //         });
            
    // }, []);

    const getEventStatus = async (start_date, last_date) => {
        const now = new Date();

        const startDate = new Date(start_date);
        const lastDate = new Date(last_date);
        try{

            const result = await axios.get("http://localhost:9988/event/ten/check", {params:{event_no}})
            if(result.data===1){
                setStatus("마감")
                return;
            }
        }catch(e){
            console.log(e);
        }
        if (now < startDate) {
            setStatus("준비중")
            return "준비중"; // 현재 날짜가 시작 날짜보다 이전
        } else if (now >= startDate && now <= lastDate) {
            setStatus("진행중");
            return "진행중"; // 현재 날짜가 시작 날짜와 종료 날짜 사이
        } else {
            setStatus("마감");
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
    useEffect(()=>{
        getEventStatus(eventView.event_startdate, eventView.event_lastdate)
    }, [eventView])
    useEffect(()=>{
        getStatusClass(status)
    }, [status])
    const isOngoing = status === "진행중";

    if (!eventView) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="event_view">
            <div className="event_top">
                <span onClick={() => navigate("/event")} className="prev">
                ⨞
                </span>
                <div className={getStatusClass(status)}>
                    <p>{status}</p>
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
                <button disabled={!isOngoing} onClick={clickSubmitEvent}>응모하기</button>
            </div>
        </div>

    );
}

export default EventView;