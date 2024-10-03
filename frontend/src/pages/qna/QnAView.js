import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../component/api/axiosApi";
import "../../css/qna/qnaView.css";

function QnAView() {
    const [QnAView, setQnAView] = useState([]);
    const params=useParams().qna_no;
    const [usersid, setUsersid]=useState('')

    useEffect(() => {
        axios.get(`http://localhost:9988/qna/view/${params}`)
            .then(response => {
                setQnAView(response.data);     
                console.log(response.data);          
            });
    }, [params]);

     //유저아이디 호출
     useEffect(()=> {
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                console.log("hi",response.data);
                if (response.data) {
                    setUsersid(response.data);
                }
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });

    },[]);

    function checkid(){
        if(usersid==='' || usersid===null){
            alert("로그인 시 이용 가능한 기능입니다.");
        }
    }

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
        {item?.qna_state == 0  ? <div>답변이 등록되지 않았습니다</div> : <div>{item?.qna_answer}</div> }
    
    <button onClick={checkid}>신고</button>
    {usersid === item?.userid ? (
            <div><button>수정</button>
            <button>삭제</button></div>
        ) : null}
    </div>


    );

}

export default QnAView;