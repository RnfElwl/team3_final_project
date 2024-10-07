import './../../css/qna/qna.css';
import React, { useState, useEffect } from 'react';
import axios from "../../component/api/axiosApi";
// import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { AiFillLock } from "react-icons/ai";
import $ from "jquery";

function QnA() {
    const [QnA, setQnA] = useState([]);
    const [privatePost, setPrivatePost] = useState(null);
    const [password, setPassword] = useState("");
    const [nowPage, setNowPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [isPasswordCheck, setIsPasswordCheck] = useState(false);
    const [searchKey, setSearchKey] =useState('qna_title');
    const [searchWord, setSearchWord] = useState('');
    const navigate = useNavigate();

    const totalPage = Math.ceil(totalRecord / 12);
    const handlePageChange = (newPage) => {
        setNowPage(newPage);
    };


    // 서버 토큰 확인 및 글 등록
    function checkid() {
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                console.log("hi",response.data);
                if(response.data === null || response.data ===''){
                    window.alert("로그인 시 이용할 수 있는 기능입니다.");
                    return false;
                }
                window.location.href = '/qna/write';
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });

    }

    // 데이터 요청
    useEffect(() => {
        //axios.get(`http://localhost:9988/qna/list?nowPage=${nowPage}`) 
        axios.get(`http://localhost:9988/qna/list?nowPage=${nowPage}&searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
    }, [nowPage]);
    
    //검색 시 데이터 요청
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setNowPage(1);  // 검색할 때 페이지를 1로 초기화
        axios.get(`http://localhost:9988/qna/list?nowPage=1&searchKey=${searchKey}&searchWord=${searchWord}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
            })
            .catch(error => {
                console.error("검색 중 오류 발생:", error);
            });
    };

    // 비밀글 모달
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

    $('.modal-wrap').click(function (e) {
        if ($(e.target).parents('.private-content').length < 1) {
            closePrivateView();
        }
    });

    // 비밀글 모달 비밀번호 확인
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
    const handlesearchKeyChange = (e) => { //검색키 처리
        setSearchKey(e.target.value);
    };
    const handlesearchWordChange = (e) => { //검색 처리
        setSearchWord(e.target.value);
    };


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
                                        {item.privacyQ == 0 ? (
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

                <div className="right-buttons write-buttons">
                    <button onClick={checkid}>등록하기</button>
                </div>
            </div>

            {/* 비밀글 모달 */}
            {privatePost && (
                <div className="modal-wrap">
                    <div className="private-content" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <h3>비밀글 알림</h3>
                            <p>이 게시글은 비밀글입니다. 비밀번호를 입력해주세요.</p>
                            <form className="qna_pwdCheckForm" onSubmit={handlePasswordSubmit}>
                                <input id="qna_password" type="password" name="userpwd" maxLength='4' value={password}
                                    onChange={handlePasswordChange} />
                                <button value="submit">입력</button>
                            </form>
                            <button onClick={closePrivateView}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 검색폼 */}
            <div>
                <form onSubmit={handleSearchSubmit}>
                    <select
                    name="searchKey"
                    value={searchKey}
                    onChange={handlesearchKeyChange}>
                        <option value="qna_title">제목</option>
                        <option value="qna_content">내용</option>
                        <option value="userid">작성자</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        id="searchWord"
                        onChange={handlesearchWordChange}/>
                    <button type="submit">검색</button>
                </form>
            </div>

            {/* 페이지네이션 */}
            <div className="qna_pagination">
                <button
                    onClick={() => handlePageChange(nowPage - 1)}
                    disabled={nowPage === 1 || totalPage===1}>
                    이전
                </button>

                {totalPage === 1 ? (
                    <button disabled>{1}</button>
                ) : (
                    Array.from({ length: totalPage }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            disabled={nowPage === index + 1}
                        >
                            {index + 1}
                        </button>
                    ))
                )}

                <button
                    onClick={() => handlePageChange(nowPage + 1)}
                    disabled={nowPage === totalPage || totalPage===1}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default QnA;
