import './../../css/admin/adminPopup.css';

import axios from "../../component/api/axiosApi";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { format,addDays } from 'date-fns';

function RepAnsWrite() {
    const reportNo = window.location.pathname.split('/').pop();
    const [reportView, setReportView] = useState([]);
    const [prevBanData, setPrevBanData]=useState([]);
    const item = reportView[0];
    const banItem=prevBanData[0];
    const [edit_user, setEdit_user] = useState([]);
    const [edit_state, setEdit_state]=useState(1);
    let reported_userid='';
    const [active_state, setActive_state]=useState(0);
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
        axios.get(`http://localhost:9988/admin/getReport/${reportNo}`)
            .then(response => {
                console.log(response.data);
                setReportView(response.data);
                reported_userid=response.data[0].reported_userid;
                console.log(reported_userid);

                axios.get(`http://localhost:9988/admin/getBanData/${reported_userid}`)
                .then(response=>{
                    console.log(response.data[0]);
                    setPrevBanData(response.data);
                    setPrevBanStartDate(response.data[0].start_banDate.slice(0, 10));
                    setPrevBanStopDate(response.data[0].stop_banDate.slice(0, 10));
                })
                .catch(error=>{
                    console.error("요청 실패!", error);
                })

            });
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

    const handleActiveState = (e) => {
        console.log("Selected value:", e.target.value);
        setActive_state(parseInt(e.target.value, 10)); //active_state가 문자로 넘어와 정수로 변환
    };

    useEffect(() => {
        console.log("active_state값:", active_state);
    }, [active_state]);

    useEffect(() => {
        console.log("stop_banDate값:", stop_banDate);
    }, [stop_banDate]);

    const handleSubmit=(e)=>{
        e.preventDefault();

        if(window.confirm("해당 신고를 저장하시겠습니까?")){
            console.log('edit_user:', edit_user);
            console.log('active_state:', active_state);
            console.log('edit_state:', edit_state);
            console.log('reported_userid',reported_userid);

            if(active_state===0){
                setStart_banDate(null);
                setStop_banDate(null);
            }


            const formData={
                updateData: {
                    report_no:reportNo,
                    edit_user:edit_user,
                    active_state:active_state,
                    edit_state:edit_state,
                }
                ,insertData:{
                    reported_userid:item.reported_userid,
                    start_banDate:start_banDate,
                    stop_banDate:stop_banDate,
                    banContent:banContent
                }
            };

            const start = new Date(start_banDate);
            const end = new Date(stop_banDate);

            console.log('form데이터 확인:', formData);
            if(start>end&&start==null){
                window.alert("시작 날짜가 종료 날짜보다 이후입니다.");
                return false;
            }
            if(active_state===''){
                window.alert("신고 유효성을 체크하여주십시오.");
                return false;
            }
            if(edit_user!=='admin1'){
                window.alert("관리자 로그인 후 진행해주십시오.");
                return false;
            }

            axios.post(`http://localhost:9988/admin/repAnsWrite/${reportNo}`, formData)
            .then((response)=>{
                if(response.data==0){
                    console.log(response.data)
                    console.log('신고 저장 실패');
                    return false;
                }else{
                    console.log('성공적으로 저장되었습니다.',response.data);
                    alert('신고 저장 완료');
                    if(window.opener){
                        window.opener.reloadReportList();
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
        <div className="RepAnsWriteBody">
            {item ? (<form className="RAWForm" onSubmit={handleSubmit}>
                <h3>신고처리</h3>
                <hr />
                <table className="reportViewTable">
                    <thead>
                        <tr>
                            <th>신고인</th>
                            <td>{item.report_userid}</td>
                            <th>피신고인</th>
                            <td>{item.reported_userid}</td>
                        </tr>
                        <tr>
                            <th>신고 유형</th>
                            <td>{item.report_type==0 ? "욕설":
                                item.report_type==1 ? "스포일러" :
                                item.report_type==2 ? "비매너행위" :
                                "기타행위"}</td>
                            <th>신고 유효</th>
                            <td>
                                <label className="report-active-label">
                                <input type="radio"
                                    value={0}
                                    name="active_state"
                                    onChange={handleActiveState}
                                    checked={active_state===0}/>
                                    <span className="report-custom-radio">무효</span>
                                </label>&nbsp;
                                <label className="report-active-label">
                                <input type="radio"
                                    value={1}
                                    name="active_state"
                                    onChange={handleActiveState}
                                    checked={active_state===1}/>
                                    <span className="report-custom-radio">유효</span>
                                </label>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>신고 내용</th>
                            <td colSpan="4">{item.report_content}</td>
                        </tr>
                        <tr>
                            <th>신고사유</th>
                            <td colSpan="3">{item.report_reason}</td>
                        </tr>
                        {banItem?
                                (<tr>
                                    <th>피신고인 이전 정지 기간</th>
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
                                disabled={active_state==0}
                                value={start_banDate}
                                onChange={(e) =>setStart_banDate(e.target.value)}/>
                                &nbsp;-&nbsp;
                            <input type="date"
                                id="stop-date"
                                max="2099-12-31"
                                min="1990-01-01"
                                required pattern="\d{4}-\d{2}-\d{2}"
                                disabled={active_state==0}
                                value={stop_banDate}
                                onChange={(e) =>setStop_banDate(e.target.value)}/>
                            </td>
                        </tr>
                        <tr>
                            <th>기간 지정</th>
                            <td colSpan="3">
                            <select id="days-select" onChange={handleDaysChange} disabled={active_state==0}>
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
                                onChange={(e)=>setBanContent(e.target.value)}
                                disabled={active_state==0}>
                                </textArea>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                <input type="hidden" value={edit_state}/><br/>
                <input type="hidden" value={edit_user}/>
                <input type="submit" value="신고 저장"/>
            </form>) :
                (<div>존재하지 않는 데이터입니다.</div>)}
        </div>
    )
}

export default RepAnsWrite;