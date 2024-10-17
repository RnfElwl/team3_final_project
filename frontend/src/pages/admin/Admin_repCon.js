import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminRepCon.css'

function RepCon(){
    const [report, setReport]=useState([]);
    const [searchKey, setSearchKey]=useState('report_userid');
    const [searchWord, setSearchWord]=useState('');
    //신고리스트 불러오기
    useEffect(()=>{
        axios.get(`http://localhost:9988/admin/repList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
        .then(response=>{
            console.log("결과:",response.data.repList);
            console.log(response.data);
            setReport(response.data.repList);
        })
    },[searchKey, searchWord]);
    
    
    return(

        <div className="AdminRepBody">
            <h3>신고 목록</h3>

            <table className="AdminRepTable">
                <thead>
                    <tr>
                        <th>
                            <input
                            type="checkbox"
                            />
                        </th>
                        <th>신고자</th>
                        <th>피신고자</th>
                        <th>신고된 글</th>
                        <th>신고 유형</th>
                        <th>신고 사유</th>
                        <th>신고 위치</th>
                        <th>신고 수리 시간</th>
                        <th>신고 수리 여부</th>
                        <th>신고 수리 담당자</th>
                        <th>신고 유효성</th>
                        <th>경고 적용</th>
                    </tr>
                </thead>
                <tbody>
                {report && report.length > 0 ? (
                        report.map((item, index) => (
                    <tr key={index}>
                        <th>
                        <input
                            type="checkbox"
                            />
                        </th>
                        <th>{item.report_userid}</th>
                        <th>{item.reported_userid}</th>
                        <th>
                            <div className="report_con_area">
                                {item.report_content}
                            </div>
                        </th>
                        <th>{item.report_type == 0? "욕설":
                            item.report_type == 1? "스포일러":
                            item.report_type == 2? "비매너 행위":
                            item.report_type == 3? "기타": ""}</th>
                        <th>{item.report_reason}</th>
                        <th>{item.report_tblname ==1? "리뷰":
                             item.report_tblname ==2? "커뮤니티":
                             item.report_tblname ==3? "채팅":
                             item.report_tblname ==4? "QnA":""}</th>
                        <th>{item.report_date}</th>
                        <th>{item.edit_state==0? "처리중":"처리됨"}</th>
                        <th>{item.edit_user}</th>
                        <th>{item.active_state!=1? "무효":"유효"}</th>
                        <th><button>신고적용</button></th>
                    </tr>)))
                    :(<tr>검색한 내용을 포함한 신고내역이 존재하지 않습니다.</tr>)}
                </tbody>

            </table>

        </div>
    )
}

export default RepCon;