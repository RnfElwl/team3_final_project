import './../../css/admin/adminPopup.css';

import axios from "../../component/api/axiosApi";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function RepAnsWrite() {
    const [answer_user, setAnswer_user] = useState([]);
    const reportNo = window.location.pathname.split('/').pop();
    console.log(reportNo);//번호 확인
    const [reportView, setReportView] = useState([]);
    const item = reportView[0];

    //관리자 체크
    useEffect(() => checkId(), [])

    function checkId() {
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                console.log(response.data);
                setAnswer_user(response.data);
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
            });
    }, []);


    return (
        <div className="RepAnsWriteBody">
            {item ? (<form className="RAWForm">
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
                            <td colSpan="3">{item.report_type==0 ? "욕설":
                                item.report_type==1 ? "스포일러" :
                                item.report_type==2 ? "비매너행위" :
                                "기타행위"}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>신고 내용</th>
                            <td colSpan="3">{item.report_content}</td>
                        </tr>
                        <tr>
                            <th>신고사유</th>
                            <td colSpan="3">{item.report_reason}</td>
                        </tr>
                        <tr>
                            <th>신고 유효</th>
                            <td>
                                <label className="report-active-label">
                                <input type="radio"
                                    value="0" 
                                    name="report_active"/>
                                    <span class="report-custom-radio">유효</span>
                                </label>
                                <label className="report-active-label">
                                <input type="radio"
                                    value="1" 
                                    name="report_active"/>
                                    <span class="report-custom-radio">유효</span>
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>) :
                (<div>존재하지 않는 데이터입니다.</div>)}
        </div>
    )
}

export default RepAnsWrite;