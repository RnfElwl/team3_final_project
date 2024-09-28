import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import './../../css/qna/qna.css';
import { AiFillLock } from "react-icons/ai";
import $ from "jquery";

function QnA() {
    const [QnA, setQnA] = useState([]);
    const [privatePost, setPrivatePost] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:9988/qna/list')
            .then(response => {
                setQnA(response.data);
            });
    }, []);

    const handlePrivateClick = (post) => {
        setPrivatePost(post);
    };

    const closePrivateView = () => {
        setPrivatePost(null);
    };

    $('.modal-wrap').click(function(e){
        if($(e.target).parents('.private-content').length < 1){
            closePrivateView();
        }
    });

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
                                            <div onClick={() => handlePrivateClick(item)}>
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
                    <button>등록하기</button>
                </div>
            </div>

            <ul className="qna pagination">
                <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#">Next</a></li>
            </ul>

            {privatePost && (
                <div className="modal-wrap">
                <div className="private-content">
                    <div>
                        <h3>비밀글 알림</h3>
                        <p>이 게시글은 비밀글입니다. 비밀번호를 입력해주세요.</p>
                        <form>
                            <input type="text" name="userpwd"/>
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