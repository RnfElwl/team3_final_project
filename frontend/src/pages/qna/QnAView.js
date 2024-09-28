import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "../../css/qna/qnaView.css";

function QnAView() {
    const [QnAView, setQnAView] = useState([]);
    const params=useParams().qna_no;

    useEffect(() => {
        axios.get(`http://localhost:9988/qna/view/${params}`)
            .then(response => {
                setQnAView(response.data);     
                console.log(response.data);          
            });
    }, [params]);

    if (!QnAView) {
        return <div>Loading...</div>;
    }

    const item=QnAView[0];

    return(
    <div className="QnAViewBody">
        {item?.userid}<br/>
        {item?.qna_no}<br/>
        {item?.qna_writedate}<br/>
        {item?.qna_title}<br/>
        {item?.qna_content}<br/>
        {item?.qna_answer == null  ? <div>답변이 등록되지 않았습니다</div> : "답변 등록됨 man!"}
    </div>

    );

}

export default QnAView;