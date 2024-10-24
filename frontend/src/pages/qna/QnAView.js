import "../../css/qna/qnaView.css";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../../component/api/axiosApi";
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineAlert } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportModal from '../../component/api/ReportModal.js';

function QnAView() {
    const location = useLocation();
    const { result: initialResult, privacyQ } = location.state || { result: null, privacyQ: null }; // 전달된 result 값
    const [result, setResult] = useState(initialResult);
    const [QnAView, setQnAView] = useState([]);
    const params=useParams().qna_no;
    const [usersid, setUsersid]=useState('');
    const navigate = useNavigate();
    const [itemQ, setItemQ]=useState([]); 
    const [qnaImgSrc, setQnaImgSrc] = useState('');
    const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
    const [report, setReport] = useState({});//신고 폼에 있는 값들어있음
    const [defaultQna,setDefaultQna ]=useState('');
    let [passCheckOk, setPassCheckOk]=useState('');
    let [passwordQ, setPasswordQ]=useState('');

 
    //뷰페이지 데이터 요청
    useEffect(() => {
        console.log("12", result, privacyQ);
        if(result === 1 || privacyQ === 0){
        axios.get(`http://localhost:9988/qna/view/${params}`)
            .then(response => {     
                console.log(response.data);
                setQnAView(response.data);     
                setQnaImgSrc(response.data[0].qna_img);
                setItemQ(response.data[0]);

                // 글이 비밀글이 아닌 경우에만 setPassCheckOk를 설정
                if (response.data[0].privacyQ !== 1 ||
                    response.data[0].next_privacyQ === 0 ||
                    response.data[0].prev_privacyQ === 0) {
                        console.log(response.data[0].next_privacyQ);
                        
                    setPassCheckOk(1);
                    setResult(1);
                }            
            });
        }else  if (result !== 1) {
            navigate(`/qna`)
            setResult(0);
            
        }
    }, [params, result, privacyQ]);


    //비밀번호 입력
    const handlePassCheck=(e)=>{
        e.preventDefault();
        setPasswordQ(e.target.value);
    }
    const handlePassSubmit=(e)=>{
        e.preventDefault();
        // setPasswordQ(post);
        console.log(e);
    };

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
    const writeDate = new Date("20"+itemQ.qna_writedate);//qna 날짜
    const currentDate = new Date();//오늘 날짜
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000; //2일 밀리초 계산
    //qna 날짜와 오늘 날짜 차이를 통해 비교
    const isTwoDaysPassed = currentDate - writeDate > twoDaysInMs;
    console.log(isTwoDaysPassed);

    //이미지 생성
    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/qna/${itemQ.qna_img}`, {
                    responseType: 'blob', // 이미지 응답을 Blob 형식으로 요청
                });
                
                const imageUrl = URL.createObjectURL(response.data); // Blob URL 생성
                setQnaImgSrc(imageUrl); // 상태 업데이트
            } catch (error) {
                console.error("오류 발생:", error);
            }
        };

        if (itemQ.qna_img) {
            fetchImage();
        }
    }, [itemQ]);


    //아이디 체크
    function checkid(){
        if(usersid==='' || usersid===null){
            alert("로그인 시 이용 가능한 기능입니다.");
            return false;
        }
    }
    //뷰페이지 로딩
    if (!QnAView) {
        return <div>Loading...</div>;
    }
    //삭제
    function qnaDelete() {
        if(window.confirm('해당 문의글을 삭제하시겠습니까?')) {
            axios.get(`http://localhost:9988/qna/viewDel/${itemQ.qna_no}`)
                .then((response) => {
                    if(response.data>0){
                        alert('삭제가 완료되었습니다. 목록으로 이동합니다.');
                        // console.log(response.data);
                        navigate('/qna');  // 삭제 성공 시 목록으로 이동
                    }else{
                        alert('삭제가 실패되었습니다.')
                    }
                })
                .catch(error => {
                    console.error('삭제 실패', error);
                    alert('삭제가 실패되었습니다.');
                    navigate(`/qna/view/${itemQ.qna_no}`);  // 삭제 실패 시 원래 페이지로 유지
                });
        } else {
            return false;  // 삭제 취소 시 아무 작업도 하지 않음
        }
    }

    //수정
    function qnaEdit(){
        window.location.href=`/qna/edit/${itemQ.qna_no}`
    }

    function openReport(id, userid, content){{/* 신고 기능 */}
    // id = e.target.dataset.id;
    // userid = e.target.dataset.userid;
    // content = e.target.dataset.content;
    setReport({
        report_tblname: 4, // 본인 테이블에 따라 다름
        report_tblno:  id, // 이건 uuid값이 아니라 id로 수정해야함
        reported_userid: userid, // 피신고자id
        report_content: content,// 피신고자의 채팅 내용
    })
    toggleReport();
}

// 모달창 열고 닫기 함수
const toggleReport = () => {
    setReportShow(!reportShow);
};


    return(
    <div>
    
    {/* {itemQ.privacyQ!=1||passCheckOk==1 ? */}
    {/* ( */}
        <div className="QnAViewBody"><h1>문의 게시판</h1>
        <table className="QnaTbl">
            <tbody>
            <tr>
                <th className="qnaType">제목</th>
                <td colSpan="3">{itemQ.qna_title}</td>
 
            </tr>
            <tr>
                <th className="qnaType">작성자</th>
                <td>{itemQ.usernick}</td> 
                <th className="qnaType">작성일</th>
                <td>{itemQ.qna_writedate}</td>        
            </tr>
            <tr>
                <th className="qnaType">내용</th>
                <td colSpan="4">
                    {itemQ.qna_content && itemQ.qna_content.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </td>
            </tr>
            <tr>
                <th className="qnaType">첨부파일</th>
                <td colSpan="4" className="qna-imgArea">
                    {itemQ.qna_img&&qnaImgSrc ? (<img src={`http://localhost:9988/${itemQ.qna_img}`}/>):<div>첨부된 파일이 없습니다.</div>}
                </td>
            </tr>
            </tbody>
        </table>
        <div className="qnaItems">
        {(usersid !== itemQ.userid && usersid !== "") ?(
            <AiOutlineAlert size="35px"
                onClick={()=>{openReport(itemQ.qna_no, QnAView[0].userid, QnAView[0].qna_content);}}
                className="qna_alert_icon"/>):null}
        {usersid === itemQ.userid || usersid==='admin1' ? (
                <div><FontAwesomeIcon icon={faTrashCan} size ="2x"onClick={qnaDelete}/></div>
            ) : null}
        {usersid === itemQ.userid && itemQ.qna_state === 0
         && !isTwoDaysPassed
          ? (
            <div>
                <FontAwesomeIcon icon={faPenToSquare} size="2x" onClick={qnaEdit} />
            </div>
        ) : null}
                <ReportModal    
                        reportShow={reportShow}// 모달창 보이기 여부
                        toggleReport={toggleReport} // 모달창 열고닫기 함수
                        report={report}// 신고 데이터 변수
                        setReport={setReport} // 신고 데이터 변수 세팅
                        setDefaultList={setDefaultQna}
                    />
        </div>
        <h4>문의 답변</h4>
        <hr className="qna_header"/>
        <div className="ansArea">
            
                {itemQ.qna_state==0 ? <div></div>:
                    <div>
                        <div>{itemQ.answer_user!=null ? "관리자":""}</div>
                        <div>{itemQ.qna_answer_date}</div>
                    </div>
                    }
                {itemQ.qna_state == 0  ? <div>답변이 등록되지 않았습니다</div> : <div>{itemQ.qna_answer}</div> }
        </div><hr className="qna_header"/>
        <div className="PagingArea">
            <div className="qna-list-btn"><button onClick={(e)=>navigate('/qna')}>목록으로</button></div>
            {itemQ.next_qna_no ?
             <div className="next-qna">다음글&nbsp;&nbsp;<div onClick={() => navigate(`/qna/view/${itemQ.next_qna_no}`, { state: { privacyQ: itemQ.next_privacyQ } })}>{itemQ.next_title}</div></div>
             :<div></div>}
            {itemQ.prev_qna_no ?
            <div className="prev-qna">이전글&nbsp;&nbsp;<div onClick={(e)=>navigate(`/qna/view/${itemQ.prev_qna_no}`, { state: { privacyQ: itemQ.prev_privacyQ } })}>{itemQ.prev_title}</div></div>
            :<div></div>} 
            {itemQ.qna_no==1 ? <div onClick={(e)=>navigate(`/qna/view/4`)}>다음글 {itemQ.next_Title}</div>:<div></div>}
        </div>
    </div>
    {/* ):(
        <div>
            <form onSubmit={(e)=>handlePassSubmit(e)}>
                <h3>문의글입니다.</h3>
                <div>들어가려면 비밀번호를 입력하여주십시오.</div>
                <input type="password" value={passwordQ} onChange={(e)=>handlePassCheck(e)}/>
                <button type="submit">확인</button>
            </form>
        </div>)} */}
</div>
    


    );

}

export default QnAView;