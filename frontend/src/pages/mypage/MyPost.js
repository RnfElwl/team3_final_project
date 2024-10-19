import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
 import '../../css/mypage/mypost.css';
import profile from '../../img/profile.png';
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { FaHeart, FaRegHeart, FaTrashCan  } from "react-icons/fa6";


function MyPost() {
    const [activeTab, setActiveTab] = useState("게시글");
    const [activeSubButton, setActiveSubButton] = useState("전체");
    const [sortOrder, setSortOrder] = useState(1); // 기본적으로 desc로 시작
    const [sortedData, setSortedData] = useState([]);

    const tabData = {
        게시글: ["전체", "게시글", "댓글", "좋아요"] ,
        리뷰: ["전체", "별점", "리뷰", "추천"],
        QnA: ["전체", "질문", "답변"],
      };

      const headers = {
        게시글: ["번호", "제목","내용", "작성자", "작성일", ""],
        리뷰: ["번호", "영화", "내용", "평점", "작성일", ""],
        QnA: ["번호", "질문", "내용",  "답변 상태", "작성일", ""],
      };
    
      const handleTabClick = (tab) => {
        setActiveTab(tab);
        setActiveSubButton("전체"); // 메인 탭이 바뀌면 sub-button을 다시 "전체"로 초기화
        setSortOrder(1); // 탭 변경 시 기본 정렬은 desc (1)
        // fetchData(tab, "전체", 1);
      };
    
      const handleSubButtonClick = (button) => {
        if (activeSubButton === button) {
            setSortOrder((prevOrder) => (prevOrder === 1 ? 0 : 1));
        } else {
            setActiveSubButton(button);
            setSortOrder(1);
        }
        // fetchData(activeTab, button, newSortOrder); // 선택한 버튼과 정렬 방식에 맞게 데이터 요청
    };
    useEffect(() => {
        // fetchData("게시글", "전체", 1); // 초기에는 게시글 탭의 전체 데이터를 desc로 로드
    }, []);

    return (
        <div className="MyPost">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "mypostinfo">
                    <div className = "myposttitle">
                        <span>글 관리</span>
                    </div>
                </div>
                <div className = "otherinfo" >
                    <div className = "filterbutton">
                        <div className="tabs">
                            {["게시글", "리뷰", "QnA"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={activeTab === tab ? "tab active" : "tab"}
                            >
                                {tab}
                            </button>
                            ))}
                        </div>

                        {/* 두 번째 버튼 그룹 */}
                        <div className="sub-buttons">
                            {tabData[activeTab].map((button) => (
                            <button
                                key={button}
                                onClick={() => handleSubButtonClick(button)} // 클릭 시 상태 업데이트
                                className={activeSubButton === button ? "sub-button active" : "sub-button"} // 활성화된 sub-button 스타일
                            >
                                {button}{" "}
                                    {activeSubButton === button && (sortOrder === 1 ? <HiSortDescending /> : <HiSortAscending />)}
                            </button>
                            ))}
                        </div>

                        {/* 제목 선택 및 검색 */}
                        <div className="search-bar">
                            <select className="dropdown">
                            <option value="title">제목</option>
                            {activeTab === "게시글" && <option value="author">작성자</option>}
                            <option value="content">내용</option>
                            </select>
                            <input type="text" placeholder="검색어 입력" className="search-input" />
                            <button className="search-button">검색</button>
                        </div>

                    </div>

                    <div style={{width:"100%", display:'flex', justifyContent:"center"}}>
                        <table className="table table-dark table-hover">
                            <thead>
                                {headers[activeTab].map((header, index) => (
                <th key={index} className={`col-md-${index === 0 ? 1 : 2}`}>{header}</th>
              ))}
                            </thead>
                            <tbody>
                                <tr>
                                    <th className = "col-md-1"> 60</th>
                                    <th className = "col-md-4">[상태]오늘영화보로가는</th>
                                    <th className = "col-md-3">진실의방으로</th>
                                    <th className = "col-md-1"><FaTrashCan /></th>
                                    <th className = "col-md-2">2024-10-14</th>
                                    <th className = "col-md-2"><FaRegHeart/></th>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                </div>
                <div className = "pagination">

                </div>

            </div>
        </div>

    );
}
export default MyPost;