import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import './../../css/qna/qna.css'

function QnA() {
    const [QnA, setQnA] = useState([]);
    useEffect(()=>{
        axios.get('http://localhost:9988/qna/list')
        .then(response=>{
            console.log("test"+response.data);
            setQnA(response.data);
            console.log(QnA);
        });
    },[]);
    useEffect(() => {
        console.log("Updated QnA state: ", QnA); // 상태가 변경되면 출력
    }, [QnA]); 

    return(
        <div className="QnABody">
        <div className="container mt-3">
            <h1>질의응답(QnA)</h1>
            <hr/>
            <table className="table table-hover QnaTable">
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
                {QnA.length > 0 ? (
                            QnA.map((item, index) => (
                                <tr key={index}>
                                    <th>{item.qna_no}</th>
                                    <th>{item.userid}</th>
                                    <th>{item.head_title==1 ? "[상품]":"[사이트]"}{item.qna_title}</th>
                                    <th>{item.qna_writedate}</th>
                                    <th>{item.qna_state==1 ? "처리후":"처리전"}</th>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Loading...</td>
                            </tr>
                        )}
                </tbody>
            </table>
        <div className="right-buttons">
            <button>등록하기</button>
        </div>
        </div>

        <ul className="pagination">
            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">Next</a></li>
        </ul>
    </div>
    );
};

export default QnA;