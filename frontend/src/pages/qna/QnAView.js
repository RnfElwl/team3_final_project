import "../../css/qna/qnaView.css";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../component/api/axiosApi";
import { Link, useNavigate } from 'react-router-dom';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineAlert } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function QnAView() {
    const [QnAView, setQnAView] = useState([]);
    const params=useParams().qna_no;
    const [usersid, setUsersid]=useState('');
    const navigate = useNavigate();
    const item=QnAView[0];

    //뷰페이지 데이터 요청
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
    //아이디 체크
    function checkid(){
        if(usersid==='' || usersid===null){
            alert("로그인 시 이용 가능한 기능입니다.");
        }
    }
    //뷰페이지 로딩
    if (!QnAView) {
        return <div>Loading...</div>;
    }
    //삭제
    function qnaDelete() {
        if(window.confirm('해당 문의글을 삭제하시겠습니까?')) {
            axios.get(`http://localhost:9988/qna/viewDel/${item.qna_no}`)
                .then(() => {
                    alert('삭제가 완료되었습니다. 목록으로 이동합니다.');
                    navigate('/qna');  // 삭제 성공 시 목록으로 이동
                })
                .catch(error => {
                    console.error('삭제 실패', error);
                    alert('삭제가 실패되었습니다.');
                    navigate(`/qna/view/${item.qna_no}`);  // 삭제 실패 시 원래 페이지로 유지
                });
        } else {
            return false;  // 삭제 취소 시 아무 작업도 하지 않음
        }
    }

    //수정
    function qnaEdit(){
        window.location.href=`/qna/edit/${item.qna_no}`
    }


    return(
    <div className="QnAViewBody">
        <table>
            <tr>
                <td>작성자</td>
                <td>{item?.userid.substring(0,2)+item?.userid.substring(2).replace(/./g, "*")}</td>
                <td>번호</td>
                <td>{item?.qna_no}</td>
            </tr>
            <tr>
                <td>작성일</td>
                <td>{item?.qna_writedate}</td>
            </tr>
            <tr>
                <td>제목</td>
                <td colspan="2">{item?.qna_title}</td>
            </tr>
            <tr>
                <td>내용</td>
                <td colspan="2"> {item?.qna_content}</td>
            </tr>
        </table>
        <hr/>답변
        <table>
            
            <tr>
                <td></td>
                <td>{item?.qna_state == 0  ? <div>답변이 등록되지 않았습니다</div> : <div>{item?.qna_answer}</div> }</td>
            </tr>
        </table>
        <br/>
       
    
    {usersid !== item?.userid ?(<AiOutlineAlert onClick={checkid} size="35px"/>):null}
    {usersid === item?.userid ? (
            <div><FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={qnaDelete}/></div>
        ) : null}
    {usersid === item?.userid && item?.qna_state === 0 ? (
            <div><FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={qnaEdit}/></div>
        ) : null}
    </div>


    );

}

export default QnAView;