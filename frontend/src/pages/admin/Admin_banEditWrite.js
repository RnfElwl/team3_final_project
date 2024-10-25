import './../../css/admin/adminPopup.css';

import axios from "../../component/api/axiosApi";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { format,addDays } from 'date-fns';

function BanEditWrite() {
    const reported_userid = window.location.pathname.split('/').pop();
    const [prevBanData, setPrevBanData]=useState([]);
    const banItem=prevBanData[0];
    const [edit_user, setEdit_user] = useState([]);
    const [edit_state, setEdit_state]=useState(1);
    const [report_types, setReport_types]=useState(0);
    const [start_banDate, setStart_banDate] = useState(null);//시작 날짜
    const [prevBanStartDate, setPrevBanStartDate]=useState('');//이전의 정지 시작 날짜
    const [daysToAdd, setDaysToAdd] = useState(0);
    const [stop_banDate, setStop_banDate]=useState(null); //끝 날짜
    const [prevBanStopDate, setPrevBanStopDate]=useState('');
    const [banContent, setBanContent]=useState('') //정지 사유

    //관리자 체크
    useEffect(() => checkId(), [])

    function checkId() {
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                console.log(response.data);
                setEdit_user(response.data);
            })
            .catch(error => {
                console.error('데이터 로드 중 오류 발생:', error);
            })
    }

    useEffect(() => {
            axios.get(`http://localhost:9988/admin/getBanData/${reported_userid}`)
            .then(response=>{
                console.log(response.data[0]);
                setPrevBanData(response.data);
                setPrevBanStartDate(response.data[0].start_banDate.slice(0, 10));
                setPrevBanStopDate(response.data[0].stop_banDate.slice(0, 10));
                // report_types를 숫자 배열로 변환
                const reportTypesArray = response.data[0].report_types.split(',').map(Number);
                            
                // 라벨을 매핑
                const reportTypeLabels = {
                    0: "욕설",
                    1: "스포일러",
                    2: "비매너 행위",
                    3: "기타 행위"
                };

                const labeledReportTypes = reportTypesArray.map(type => reportTypeLabels[type]);

                setReport_types(labeledReportTypes); // 상태에 저장
            })
            .catch(error=>{
                console.error("요청 실패!", error);
            })
        }, []);



    useEffect(() => {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setStart_banDate(formattedDate);
    }, []); //시작 날짜 오늘로 input

    const handleDaysChange = (event) => {
        const selectedDays = parseInt(event.target.value, 10);
        setDaysToAdd(selectedDays);
    
        if (start_banDate) {
          // 선택된 날짜를 Date 객체로 변환
          const selectedDate = new Date(start_banDate);
          // 선택된 날짜에 일수를 더함
          const newDate = addDays(selectedDate, selectedDays);
          setStop_banDate(format(newDate, 'yyyy-MM-dd'));
        }
      };

    useEffect(() => {
        console.log("stop_banDate값:", stop_banDate);
    }, [stop_banDate]);

    const handleSubmit=(e)=>{
        e.preventDefault();

        if(window.confirm("해당 신고를 저장하시겠습니까?")){
            console.log('edit_user:', edit_user);
            console.log('edit_state:', edit_state);
            console.log('reported_userid',reported_userid);



            const formData = {
                userid: reported_userid,
                start_banDate: start_banDate,
                stop_banDate: stop_banDate,
                banContent: banContent
            };

            const start = new Date(start_banDate);
            const end = new Date(stop_banDate);

            console.log('form데이터 확인:', formData);
            if(start>end){
                window.alert("시작 날짜가 종료 날짜보다 이후입니다.");
                return false;
            }
            if(edit_user!=='admin1'){
                window.alert("관리자 로그인 후 진행해주십시오.");
                return false;
            }
            if(!banContent){
                window.alert("처분사유를 정확히 입력하여주십시오");
                return false;
            }
        

            axios.post(`http://localhost:9988/admin/editBanDate`, formData)
            .then((response)=>{
                if(response.data==0){
                    console.log(response.data)
                    console.log('신고 저장 실패');
                    return false;
                }else{
                    console.log('성공적으로 저장되었습니다.',response.data);
                    alert('신고 저장 완료');
                    if(window.opener){
                        window.opener.fetchBanMemList();
                    }
                    window.close();
                }
            }).catch((error)=>{
                console.error('신고 저장 실패', error);
            })
        }else{
            console.log('신고처리 취소');
            return;
        }
    }




    return (
        <div className="BanEditWriteBody">
            {banItem ? (<form className="RAWForm" onSubmit={handleSubmit}>
                <h3>정지 기간 처리</h3>
                <hr />
                <table className="reportViewTable">
                    <thead>
                        <tr>
                            <th>피신고인</th>
                            <td>{banItem.userid}</td>
                        </tr>
                         <tr>
                             <th>신고 종류</th>
                             <td> {report_types.join(', ')}</td>
                         </tr>
                    </thead>
                    <tbody>
                         {/* <tr>
                             <th>신고 내용</th>
                             <td colSpan="4">{item.report_content}</td>
                         </tr> */}
                        <tr>
                            <th>이전 처분 사유</th>
                            <td colSpan="3">{banItem.banContent}</td>
                        </tr>
                        {banItem?
                                (<tr>
                                    <th>이전 정지 기간</th>
                                    <td colSpan="3">
                                    {prevBanStartDate} ~ {prevBanStopDate}
                                    </td>
                                </tr>)
                            :null}
                        <tr>

                            <th>{"피신고인 정지 기간"}</th>
                            <td colSpan="3">
                            <input type="date"
                                id="start-date"
                                max="2099-12-31"
                                min="1990-01-01"
                                required pattern="\d{4}-\d{2}-\d{2}"
                                value={start_banDate}
                                onChange={(e) =>setStart_banDate(e.target.value)}/>
                                &nbsp;-&nbsp;
                            <input type="date"
                                id="stop-date"
                                max="2099-12-31"
                                min="1990-01-01"
                                required pattern="\d{4}-\d{2}-\d{2}"
                                value={stop_banDate}
                                onChange={(e) =>setStop_banDate(e.target.value)}/>
                            </td>
                        </tr>
                        <tr>
                            <th>기간 지정</th>
                            <td colSpan="3">
                            <select id="days-select" onChange={handleDaysChange}>
                                <option value="0">선택하세요</option>
                                <option value="1">1일</option>
                                <option value="3">3일</option>
                                <option value="7">7일</option>
                                <option value="15">15일</option>
                                <option value="30">30일</option>
                            </select>
                            </td>
                        </tr>
                        <tr>
                            <th>처분 사유</th>
                            <td colSpan="3">
                                <textArea
                                value={banContent}
                                onChange={(e)=>setBanContent(e.target.value)}>
                                </textArea>
                            </td>
                        </tr>            
                    </tbody>
                </table>
                <input type="hidden" value={edit_state}/><br/>
                <input type="hidden" value={edit_user}/>
                <input type="submit" value="기간 변경"/>
            </form>) :
                (<div>존재하지 않는 데이터입니다.</div>)}
        </div>
    )
}

export default BanEditWrite;