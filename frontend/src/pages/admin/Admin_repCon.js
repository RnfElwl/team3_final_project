import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import $ from "jquery";

import './../../css/admin/adminRepCon.css'

function RepCon(){
    const [report, setReport]=useState([]);
    const [searchKey, setSearchKey]=useState('report_userid');
    const [searchWord, setSearchWord]=useState('');
    const [checkedReps, setCheckedReps] = useState(new Array(report.length).fill(false));
    const [isExpanded, setIsExpanded] = useState(false);

    const [isCollapsed, setIsCollapsed] = useState(true); // 초기 상태를 접힌 상태로 설정
    
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed); // 버튼 클릭 시 상태 토글
    };


    //검색 처리
    const handlesearchKeyChange = (e) => { //검색키 처리
        e.preventDefault();
        setSearchKey(e.target.value);
    };
    const handlesearchWordChange = (e) => { //검색 처리
        e.preventDefault();
        setSearchWord(e.target.value);
    };

    //리스트 리로드 함수
    function reloadReportList() {
        axios.get(`http://localhost:9988/admin/repList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
            .then(response => {
                console.log("결과:", response.data.repList);
                setReport(response.data.repList);
            });
    }
    useEffect(()=>{
        axios.get(`http://localhost:9988/admin/repList?searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
        .then(response=>{
            console.log("결과:",response.data.repList);
            console.log(response.data);
            setReport(response.data.repList);
        })
    },[searchKey, searchWord]);

       //신고처리 팝업 창 열기
    const openAddReportAnsWindow = (report_no) => {
        console.log("넘긴 번호"+report_no);
        window.open(`http://localhost:3000/admin/repAns/${report_no}`, '_blank', 'width=600,height=400,top=200,left=200');
    };
    useEffect(() => {
        window.reloadReportList = reloadReportList;  // 전역 함수로 등록
    }, []);

    
    return(

        <div className="AdminRepBody">
            <h3>신고 목록</h3>
            <div>
                <form>
                    <select
                        className="repSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}>
                        <option value="report_userid">신고자 ID</option>
                        <option value="reported_userid">피신고자 ID</option>
                        <option value="userid">신고된 글</option>
                        <option value="report_content">신고 사유</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        className="repSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />
                </form>
            </div>
            <table className="AdminRepTable">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>신고자</th>
                        <th>피신고자</th>
                        <th>신고된 글</th>
                        <th>신고 유형</th>
                        <th>신고 사유</th>
                        <th>신고 위치</th>
                        <th>신고 시간</th>
                        <th>신고 수리 여부</th>
                        <th>신고 수리 시간</th>
                        <th>신고 수리 담당자</th>
                        <th>신고 유효성</th>
                        <th>경고 적용</th>
                    </tr>
                </thead>
                <tbody>
                {report && report.length > 0 ? (
                        report.map((item, index) => (
                    <tr key={index}>
                        <td>{item.report_no}</td>
                        <td>{item.report_userid}</td>
                        <td>{item.reported_userid}</td>
                        <td>
                            <div className="report_con_area">
                            {item.report_content.length > 20 ? (
                                <>
                                    <div>
                                    {item.report_content.substring(0, 20)}
                                    </div>
                                    <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={toggleCollapse} // 클릭 시 상태 토글
                                    >
                                    {isCollapsed ? "더보기" : "접기"} {/* 상태에 따라 버튼 텍스트 변경 */}
                                    </button>
                                    {!isCollapsed && ( // 상태가 false일 때만 전체 내용 표시
                                    <div>
                                        {item.report_content}
                                    </div>
                                    )}
                                </>
                                ) : (
                                <div>{item.report_content}</div> // 20자 이하인 경우
                                )}
                            </div>
                        </td>
                        <td>{item.report_type == 0? "욕설":
                            item.report_type == 1? "스포일러":
                            item.report_type == 2? "비매너 행위":
                            item.report_type == 3? "기타": ""}</td>
                        <td>{item.report_reason}</td>
                        <td>{item.report_tblname ==1? (<div>리뷰:{item.report_tblno}</div>):
                             item.report_tblname ==2? (<div>커뮤니티:{item.report_tblno}</div>):
                             item.report_tblname ==3? (<div>채팅:{item.report_tbluuid}</div>):
                             item.report_tblname ==4? (<div>문의:{item.report_tblno}</div>):""}</td>
                        <td>{item.report_date}</td>
                        <td>{item.edit_state==0? "처리중":"처리됨"}</td>
                        <td>{item.edit_date}</td>
                        <td>{item.edit_user}</td>
                        <td>{item.active_state!=1? "무효":"유효"}</td>
                        <td>{item.edit_state==0?(<button className="repAnswerModify-btn"
                                        onClick={(e)=>{e.preventDefault(); openAddReportAnsWindow(item.report_no);}}>신고 처리</button>)
                                    :(<button className="repAnswerAdd-btn"
                                        onClick={(e)=>{e.preventDefault(); openAddReportAnsWindow(item.report_no);}}>신고 수정</button>)}</td>
                    </tr>)))
                    :(<tr><td colSpan="13">검색한 내용을 포함한 신고내역이 존재하지 않습니다.</td></tr>)}
                </tbody>

            </table>

        </div>
    )
}

export default RepCon;