import react, { useState } from 'react';
//import '../App.css';
import axios from 'axios';
import '../../css/mypage/mypage.css';
import profile from '../../img/profile.png';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

function Mypage() {
    return (
        <div className="myPage">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "info">
                    <div id = "profile">
                        <img src = {profile} alt = "프로필"/>
                        <span>사용자1님</span>
                    </div>
                    <div id = "userinfo">
                        <p>이름 : <span>홍길동</span></p>
                        <p>주소 : <span>서울특별시 성동구 아차산로 113, 2층(성수동 2가, 삼전빌딩)</span></p>
                        <p>전화번호 : <span>010-1234-1234</span></p>
                        <p>이름 : <span>hong@hong.com</span></p>
                    </div>
                    <div id = "info_change">
                        <button class="btn btn-secondary"><FontAwesomeIcon icon={faPenToSquare} />관리하기</button>
                    </div>
                </div>
                {/* 시청기록 */}
                <div className = "recent_watch">
                    <div className = "content_title">
                        <span>최근기록</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    </div>
                </div>
                {/* 즐겨찾기 */}
                <div className = "bookmark">
                    <div className = "content_title">
                        <span>즐겨찾기</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    </div>
                </div>
                {/* 즐찾 회원 */}
                <div className = "follower">
                    <div className = "content_title">
                        <span>팔로워</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    </div>
                </div>
                {/* 내가 쓴 글 */}
                <div className = "write">
                    <div className = "content_title">
                        <span>내가 쓴 글</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    <ul style={{ display: 'inline-block', color : 'white' }}>
                        <li style={{ display: 'inline', marginRight:'20px' }}>글</li>
                        <li style={{ display: 'inline' }}>댓글</li>
                    </ul>
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th class = "col-md-1">번호</th>
                                <th class = "col-md-2">작성한 곳</th>
                                <th class = "col-md-6">제목</th>
                                <th class = "col-md-2">작성일</th>
                                <th class = "col-md-1"></th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>70</td>
                                <td>커뮤니티</td>
                                <td>베테랑 2 재미있음?</td>
                                <td>2024-09-10</td>
                                <th>
                                    <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                </th>
                            </tr>
                            <tr>
                                <td>71</td>
                                <td>커뮤니티</td>
                                <td>탈출 보고옴</td>
                                <td>2024-09-11</td>
                                <th>
                                    <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                </th>
                            </tr>
                            <tr>
                                <td>72</td>
                                <td>커뮤니티</td>
                                <td>안본 흑우</td>
                                <td>2024-09-13</td>
                                <th>
                                    <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                {/* Q&A */}
                <div className = "qna">
                    <div className = "content_title">
                        <span>QnA</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th class = "col-md-1">번호</th>
                                <th class = "col-md-2">문의종류</th>
                                <th class = "col-md-3">제목</th>
                                <th class = "col-md-2">상태</th>
                                <th class = "col-md-3">작성일</th>
                                <th class = "col-md-1"></th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>3</td>
                                <td>서버 문의</td>
                                <td>서버가 느려요</td>
                                <td>처리 중</td>
                                <td>2024-09-10</td>
                                <th>
                                    <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                </th>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>배송 문의</td>
                                <td>택배 언제와요</td>
                                <td>처리 완료</td>
                                <td>2024-09-08</td>
                                <th>
                                    <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                </th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>서버 문의</td>
                                <td>얘 비매너에요</td>
                                <td>처리 중</td>
                                <td>2024-09-13</td>
                                <th>
                                    <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                {/* 장바구니 */}
                <div className = "cart">
                    <div className = "content_title">
                        <span>장바구니</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    </div>
                </div>
                {/* 배송내역 */}
                <div className = "delivery">
                    <div className = "content_title">
                        <span>배송내역</span>
                        <a href = "#"> 더보기 {'>'}</a>
                    </div>
                    <div className = "content_info">
                    </div>
                </div>

            </div>
        </div>

    );
}
export default Mypage;