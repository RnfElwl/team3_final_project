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
    const [qnaImgSrc, setQnaImgSrc] = useState('');

    //뷰페이지 데이터 요청
    useEffect(() => {
        axios.get(`http://localhost:9988/qna/view/${params}`)
            .then(response => {
                setQnAView(response.data);     
                console.log(response.data);
                setQnaImgSrc(response.data[0].qna_img)       
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
    //수정 제한을 위한 날짜 체크
    const writeDate = new Date("20"+item?.qna_writedate);//qna 날짜
    const currentDate = new Date();//오늘 날짜
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; //2일 밀리초 계산
    //qna 날짜와 오늘 날짜 차이를 통해 비교
    const isTwoDaysPassed = currentDate - writeDate > twoDaysInMs;
    console.log(isTwoDaysPassed);




    //이미지 생성
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/qna/${item?.qna_img}`, {
                    responseType: 'blob', // 이미지 응답을 Blob 형식으로 요청
                });
                
                const imageUrl = URL.createObjectURL(response.data); // Blob URL 생성
                setQnaImgSrc(imageUrl); // 상태 업데이트
            } catch (error) {
                console.error("오류 발생:", error);
            }
        };

        if (item?.qna_img) {
            fetchImage();
        }
    }, [item]);

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
            axios.get(`http://localhost:9988/qna/viewDel/${item?.qna_no}`)
                .then(() => {
                    alert('삭제가 완료되었습니다. 목록으로 이동합니다.');
                    navigate('/qna');  // 삭제 성공 시 목록으로 이동
                })
                .catch(error => {
                    console.error('삭제 실패', error);
                    alert('삭제가 실패되었습니다.');
                    navigate(`/qna/view/${item?.qna_no}`);  // 삭제 실패 시 원래 페이지로 유지
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
        <h1>문의 게시판</h1>
        <table className="QnaTbl">
            <tbody>
            <tr>
                <td className="qnaType">제목</td>
                <td >{item?.qna_title}</td>
                <td>{item?.qna_writedate}</td>
            </tr>
            <tr>
                <td className="qnaType">작성자</td>
                <td colSpan="2">{item?.usernick}</td>          
            </tr>
            <tr>
                <td colSpan="3"> {item?.qna_content}</td>
            </tr>
            <tr>
                <td className="qnaType">첨부파일</td>
                <td colSpan="2" className="qna-imgArea">
                    {item?.qna_img&&qnaImgSrc ? (<img src={qnaImgSrc}/>):<div>첨부된 파일이 없습니다.</div>}
                </td>
            </tr>
            </tbody>
        </table>
        <div className="qnaItems">
        {usersid !== item?.userid ?(<div><AiOutlineAlert onClick={checkid} size="35px"/></div>):null}
        {usersid === item?.userid || usersid==='admin1' ? (
                <div><FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={qnaDelete}/></div>
            ) : null}
        {usersid === item?.userid && item?.qna_state === 0
         && !isTwoDaysPassed
          ? (
            <div>
                <FontAwesomeIcon icon={faPenToSquare} size="2x" onClick={qnaEdit} />
            </div>
        ) : null}
        </div>
        <hr/>
        <div className="ansArea">
            답변
                {item?.qna_state == 0  ? <div>답변이 등록되지 않았습니다</div> : <div>{item?.qna_answer}</div> }
        </div>
        <br/>
        <div className="PagingArea">
            <button onClick={(e)=>navigate('/qna')}>목록으로</button>
            {item?.next_qna_no ?
             <div onClick={(e)=>navigate(`/qna/view/${item.next_qna_no}`)}>다음글 {item?.next_title}</div>
             :<div></div>}
            {item?.prev_qna_no ?
            <div onClick={(e)=>navigate(`/qna/view/${item.prev_qna_no}`)}>이전글 {item?.prev_title}</div>
            :<div></div>} 
            {item?.qna_no==1 ? <div onClick={(e)=>navigate(`/qna/view/4`)}>다음글 {item?.next_Title}</div>:<div></div>}
        </div>
       
    

    </div>


    );

}

export default QnAView;