import styled from './../../css/admin/adminPopup.css';

import axios from "../../component/api/axiosApi";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';



function QnaAnsWrite(){
    const [QAWView, setQAWView] = useState([]);//받은 문의 내용
    const params=useParams().qna_no; //params의 qna넘버
    const item=QAWView[0]; //받은 데이터
    const [ansImgSrc,setAnsImgSrc]=useState(''); //문의 첨부 이미지
    const [qna_answer, setQna_answer]=useState('');//답변 내용
    const[answer_user, setAnswer_user] =useState([]);//답변하는 운영자 아이디
    const [qna_state]=useState(1); //문의 상태


    //관리자 아이디 체크
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

    //뷰페이지의 데이터 가져오기
    useEffect(() => {
        axios.get(`http://localhost:9988/qna/view/${params}`)
            .then(response => {
                setQAWView(response.data);     
                console.log(response.data);
                setAnsImgSrc("http://localhost:9988/"+response.data[0].qna_img);
                if(response.data[0].qna_answer!=null){
                    setQna_answer(response.data[0].qna_answer);
                }      
            });
    }, [params]);

    //qna 답변 전송
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData={
            answer_user:answer_user,
            qna_state:qna_state,
            qna_answer:qna_answer
        };

        console.log('form데이터 확인:',formData);

        if(!qna_answer){
            alert('답글 내용을 입력하십시오.');
            return;
        }
        if(!answer_user){
            alert('no userData');
            return;
        }
        axios.post(`http://localhost:9988/admin/qnaAnswerWrite/${params}`, formData)
        .then((response)=>{
            if(response.data == 0){
                console.log('잘못된 등록입니다.');
                alert('답글 등록 실패');
                return false;
            }else{
                console.log('답글이 성공적으로 등록 되었습니다.',response.data);
                alert('답글 등록 완료');
                if (window.opener) {
                    window.opener.location.reload();
                }
                window.close();
            }
        }).catch((error)=>{
            console.error('답글 등록 실패',error);
        });
    }

    return(
        <div className="QnaAnsWriteBody">
            <h3 className="QnaAnsWriteTitle">QnA 답변 등록폼</h3>
            <div className="QAWContents">
                <table className="QAWTable">
                    <tbody>
                        <tr>
                        <td className="QAWTtitle">등록자</td>
                        <td>{item?.usernick}</td>
                        <td className="QAWTtitle">등록일</td>
                        <td>{item?.qna_writedate}</td>
                        </tr>
                        <tr>
                            <td className="QAWTtitle">문의 제목</td>
                            <td colSpan="3">{item?.qna_title}</td>
                        </tr>
                        <tr>
                            <td className="QAWTtitle" style={{height:"40px"}}>문의 내용</td>
                            <td colSpan="3">
                                <div className="QAWContent_4">{item?.qna_content}</div>     
                            </td>
                        </tr>
                        <tr>
                        <td className="QAWTtitle">첨부이미지</td>
                            <td colSpan="3">
                            {item?.qna_img==null ? <div>이미지가 없습니다</div>:
                                (<a href={ansImgSrc} target="_blank">
                                <img src={ansImgSrc}
                                onError={(e) => e.target.style.display = 'none'}
                                    className="ansImg"/></a>)      
                            }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <form className="QAWForm" onSubmit={handleSubmit}>
                <div className="qna_answer_user">
                    <input type="hidden"     
                        value={answer_user}
                        />
                </div>
                <textarea
                    className="QAWContent"
                    value={qna_answer}
                    onChange={
                    (e) => {
                        setQna_answer(e.target.value)
                    }}>
                </textarea>
                <div>
                <button
                    type='submit'
                    className="qnaWrite-btn">
                        등록</button>
                </div>
            </form>
        </div>
    )
}

export default QnaAnsWrite;