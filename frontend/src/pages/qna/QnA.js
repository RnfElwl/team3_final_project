import React, { useState, useEffect } from 'react';
//import axios from "../../component/api/axiosApi";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import './../../css/qna/qna.css';
import { AiFillLock } from "react-icons/ai";
import $ from "jquery";
import ReactPaginate from 'react-paginate';

function QnA() {
    const [QnA, setQnA] = useState([]);
    const [privatePost, setPrivatePost] = useState(null);
    const [password, setPassword] = useState("");
    const [isPasswordCheck, setIsPasswordCheck] = useState(false);
    const navigate = useNavigate();
    const tokenData=localStorage.getItem("token");

    useEffect(() => {
        axios.get('http://localhost:9988/qna/list')
            .then(response => {
                setQnA(response.data);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
    }, []);


    const handlePrivateClick = (post) => {
        setPrivatePost(post);
        setPassword("");
        setIsPasswordCheck(false);
    };

    const closePrivateView = () => {
        setPrivatePost(null);
    };

        const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    $('.modal-wrap').click(function(e){
        if($(e.target).parents('.private-content').length < 1){
            closePrivateView();
        }
    });


    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (privatePost && password === privatePost.qna_pwd) {
            setIsPasswordCheck(true);
            navigate(`/qna/view/${privatePost.qna_no}`);
        } else {
            alert("비밀번호가 틀렸습니다!");
            setIsPasswordCheck(false);
        }
    };
    function checkid() {
        axios.get('http://localhost:9988/user/userinfo')
        .then(response => {
            console.log(response.data); // 응답 데이터 출력
        })
        .catch(error => {
            console.error("데이터 로드 중 오류 발생:", error); // 오류 처리
        });
    }


    

    return (
        <div className="QnABody">
    
            <div className="container mt-3">
                <h1>질의응답(QnA)</h1>
                <hr />
                <table className="table table-dark table-hover QnaTable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>작성자</th>
                            <th>제목</th>
                            <th>등록일</th>
                            <th>답변여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {QnA.length > 0 ? (
                            QnA.map((item, index) => (
                                <tr key={index}>
                                    <th>{item.qna_no}</th>
                                    <th>{item.userid}</th>

                                    <th className="qna_ht_th">
                                        {item.head_title == 1 ? <div className="qna_ht">[상품]&nbsp;</div> :
                                            (item.head_title == 2 ? <div className="qna_ht">[사이트]&nbsp;</div> :
                                                <div className="qna_ht">[기타]&nbsp;</div>)}
                                        {item.privacy == 0 ? (
                                            <Link to={`/qna/view/${item.qna_no}`}>{item.qna_title}</Link>
                                        ) : (
                                            <div className="qna_pwt" onClick={() => handlePrivateClick(item)}>
                                                비밀글입니다. <AiFillLock />
                                            </div>
                                        )}
                                    </th>
                                    <th>{item.qna_writedate}</th>
                                    <th>{item.qna_state == 1 ? "답변됨" : "답변 없음"}</th>
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
                    <button onClick = "checkid()">등록하기</button>
                    <button onClick={checkid}>등록하기1</button>
                </div>
            </div>

            {privatePost && (
                <div className="modal-wrap">
                <div className="private-content" onClick={(e) => e.stopPropagation()}>
                    <div>
                        <h3>비밀글 알림</h3>
                        <p>이 게시글은 비밀글입니다. 비밀번호를 입력해주세요.</p>
                        <form className="qna_pwdCheckForm" onSubmit={handlePasswordSubmit}>
                            <input id="qna_password" type="password" name="userpwd" maxLength='4'  value={password}
                                onChange={handlePasswordChange}/>
                            <button value="submit">입력</button>

                        </form>
                        <button onClick={closePrivateView}>닫기</button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}

export default QnA;