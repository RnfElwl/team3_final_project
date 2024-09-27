import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import './../../css/qna/qna.css'

function QnA() {
//     const [QnA, setQnA] = useState([]);
//     useEffect(()=>{
//         axios.get('')
//         .then(response=>{
//             setQnA(response.data);
//         });
//     },[]);

    return(
        <div className="QnABody">
        <h1>질의응답(QnA)</h1>
        <hr/>
        <container className="container mt-3">
            <table class="table table-hover QnaTable">
                <thead>
                <tr>
                    <th>No.</th>
                    <th>작성자</th>
                    <th>제목</th>
                    <th>등록일</th>
                    <th>등록여부</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>1</th>
                    <th>일반</th>
                    <th>[헤드 타이틀]제목 내용입니다.</th>
                    <th>2024-09-27 13:03</th>
                    <th>답변완료</th>
                </tr>
                </tbody>
            </table>
        </container>
        <div className="right-buttons">
            <button>등록하기</button>
        </div>
        </div>
    );
}

export default QnA;