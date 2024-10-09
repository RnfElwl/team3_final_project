import React, { useState } from 'react';
import axios from '../../component/api/axiosApi.js';

const ReportModal = ({ reportShow, toggleReport, report, setReport }) =>{

    function reportFormAdd(event){
        let idField = event.target.name;
        let idValue = event.target.value;
        setReport(p=>{return {...p, [idField]:idValue}});
    }
    async function submitReport(e){{/* 신고 기능 */}
        e.preventDefault();
        const result = await axios.post("http://localhost:9988/report/submit", report, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if(result.status==200){
            toggleReport();
          }
    }

    return(
        <div className={`report_window ${reportShow ? 'report_show':'report_hide'}`}>
            <div className='report_close' onClick={toggleReport}></div>
            <form className="chatting_report" onSubmit={submitReport}>
                <div className="title" >
                    <h2>신고하기</h2>
                    <div>
                        <input type="radio" name="report_type" value='0' onChange={reportFormAdd} /><span>욕설</span>
                        <input type="radio" name="report_type" value='1' onChange={reportFormAdd}/><span>스포일러</span>
                        <input type="radio" name="report_type" value='2' onChange={reportFormAdd}/><span>비매너 행위</span>
                        <input type="radio" name="report_type" value='3' onChange={reportFormAdd}/><span>기타</span>
                    </div>
                </div>
                <div className="sub_title">
                <h2>상세내용</h2>
                <textarea name="report_reason" onChange={reportFormAdd}>

                </textarea>
                </div>
                <button type="submit">방만들기</button>
            </form>
    </div> 
    )
}

export default ReportModal;