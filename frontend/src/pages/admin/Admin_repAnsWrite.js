import './../../css/admin/adminPopup.css';

import { useParams } from 'react-router-dom';
import axios from "../../component/api/axiosApi";
import React, { useState, useEffect, useRef } from 'react';


function RepAnsWrite(){
    const[answer_user, setAnswer_user] =useState([]);//답변하는 운영자 아이디

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

    const report_no=useParams().report_no

    return(
        <div className="RepAnsWriteBody">
            신고 처리 폼 {report_no}
        </div>
    )
}

export default RepAnsWrite;