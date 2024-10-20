import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from "jquery";

import './../../css/admin/adminRepCon.css'

function RepCon(){
    const [report, setReport]=useState([]);
    const [searchKey, setSearchKey]=useState('report_userid');
    const [searchWord, setSearchWord]=useState('');
    const [checkedReps, setCheckedReps] = useState(new Array(report.length).fill(false));
    //신고리스트 불러오기
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
        window.open(`http://localhost:3000/admin/repAns/${report_no}`, '_blank', 'width=600,height=584');
    };

    //팝업 창으로 데이터 전송

    //체크 전체 관리
    const [isAllRepChecked, setAllRepChecked] = useState(false);
    const handleAllRepChecked = () => {
        const newCheckedState = !isAllRepChecked;
        setAllRepChecked(newCheckedState);
        setCheckedReps(new Array(report.length).fill(newCheckedState));  
      };
    // 모든 항목의 체크 상태를 동일하게 변경
    const handleRepChecked = (index) => {
        const newCheckedReps = [...checkedReps];
        newCheckedReps[index] = !newCheckedReps[index]; // 해당 항목의 체크 상태 변경
        setCheckedReps(newCheckedReps);

        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllRepChecked(newCheckedReps.every(item => item === true));
    };

    //useEffect를 사용하여 QnA 데이터가 변경될 때 체크 상태 초기화
    useEffect(() => {
        setCheckedReps(new Array(report.length).fill(false)); // QnA 데이터 변경 시 체크 상태 초기화
        setAllRepChecked(false); // 전체 체크박스 상태 초기화
    }, [report]);


    
    
    return(

        <div className="AdminRepBody">
            <h3>신고 목록</h3>

            <table className="AdminRepTable">
                <thead>
                    <tr>
                        <th>
                            <input
                            type="checkbox"
                            checked={isAllRepChecked}
                            onChange={handleAllRepChecked}/>
                        </th>
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
                        <td>
                        <input
                            type="checkbox"
                            checked={checkedReps[index]}
                            value={item.report_no || ''}
                            onChange={() => handleRepChecked(index)}/>
                        </td>
                        <td>{item.report_no}</td>
                        <td>{item.report_userid}</td>
                        <td>{item.reported_userid}</td>
                        <td>
                            <div className="report_con_area">
                                {item.report_content}
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
                                        onClick={(e)=>{e.preventDefault(); openAddReportAnsWindow(item.report_no);}}>신고 처리 수정</button>)}</td>
                    </tr>)))
                    :(<tr>검색한 내용을 포함한 신고내역이 존재하지 않습니다.</tr>)}
                </tbody>

            </table>

        </div>
    )
}

export default RepCon;