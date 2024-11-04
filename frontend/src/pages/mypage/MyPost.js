import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import '../../css/mypage/mypost.css';
import profile from '../../img/profile.png';
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { FaHeart, FaRegHeart, FaTrashCan  } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

function MyPost() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("게시글");
    // const tabs = ["게시글", "리뷰", "QnA"];
    const tabNames = {
        게시글: "community",
        리뷰: "review",
        QnA: "qna"
    };
    const tabs = Object.keys(tabNames);
    
    const [activeSubButton, setActiveSubButton] = useState("전체");
    const [sortOrder, setSortOrder] = useState(1); // 기본적으로 desc로 시작
    const [sortedData, setSortedData] = useState([]);

    const [searchType, setSearchType] = useState("title");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false); // 검색 중인지 상태 추가

    const [nowPage, setNowPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
        //전체페이지 계산
        const totalPage = Math.ceil(totalRecord / 5);

    const tabData = {
        게시글: { display: ["전체", "게시글", "댓글", "좋아요"], send: ["all", "community", "comment", "like"] },
        리뷰: { display: ["전체", "별점", "리뷰"], send : ["all", "rate", "review"] },
        QnA: { display:["전체", "질문", "답변"], send : ["all", "title" ,"answer"] }
      };

    const headers = {
        게시글: [
            { name: "번호", col: 1 },
            { name: "제목", col: 3 },
            { name: "내용", col: 3 },
            { name: "작성자", col: 2 },
            { name: "작성일", col: 2 },
            { name: "", col: 1 }
        ],
        리뷰: [
            { name: "번호", col: 1 },
            { name: "영화", col: 3 },
            { name: "내용", col: 3 },
            { name: "평점", col: 2 },
            { name: "작성일", col: 2 },
            { name: "", col: 1 }
        ],
        QnA: [
            { name: "번호", col: 1 },
            { name: "질문", col: 3 },
            { name: "내용", col: 3 },
            { name: "답변 상태", col: 2 },
            { name: "작성일", col: 2 },
            { name: "", col: 1 }
        ]
      };
    
    const searchTypeNames = {
        제목: "title",
        작성자: "usernick",
        내용: "content"
    };
    
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setActiveSubButton("전체");
        setSortOrder(1);
        setSearchKeyword("");
    };
    
    const handleSubButtonClick = (button) => {
        if (activeSubButton === button) {
            setSortOrder((prevOrder) => (prevOrder === 1 ? 0 : 1));
        } else {
            setActiveSubButton(button);
            setSortOrder(1);
        }
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleSearchKeywordChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchClick = () => {
        setIsSearching(true);
        console.log("handleSearchClick 호출됨: ", searchType, searchKeyword);
        const englishTab = tabNames[activeTab];
        const sortColumn = tabData[activeTab].send[tabData[activeTab].display.indexOf(activeSubButton)];
        const engorder = sortOrder === 1 ? "desc" : "asc";
        fetchData(englishTab, sortColumn, engorder, searchType, searchKeyword);
    };

    const fetchData = async (tab, column, order, searchType, searchKeyword) => {
        try {
            const params = {
                column: column,
                order: order,
                offset: nowPage * 5 - 5
            };
    
            if (searchKeyword) {
                params.searchType = searchType;
                params.searchKeyword = searchKeyword;
            }
    
            const response = await axios.get(`http://localhost:9988/user/myposts/${tab}`, { params });
            console.log(response.data.postdata);
            setSortedData(response.data.postdata);
            setTotalRecord(response.data.posts);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.error === "Need login") {
                    alert("로그인이 필요합니다.");
                    navigate('/signin');
                }
            } else {
                console.error("데이터 로드 중 오류 발생:", error);
            }
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        setNowPage(1);
    }, [activeTab, activeSubButton]);

    useEffect(() => {
        console.log("호출");
        if (!isSearching && activeSubButton) { // 검색 중이 아닐 때만 fetchData 호출
            const englishTab = tabNames[activeTab];
            const sortColumn = tabData[activeTab].send[tabData[activeTab].display.indexOf(activeSubButton)];
            const engorder = sortOrder === 1 ? "desc" : "asc";
            fetchData(englishTab, sortColumn, engorder, searchType, searchKeyword);
        }
    }, [sortOrder, activeSubButton, activeTab, nowPage]); // sortOrder 또는 activeSubButton이 변경될 때마다 실행
    const handleRowClick = (data) => {
        let path = "";
        if (activeTab === "게시글") {
            path = `/community/communityview/${data.no}`;
        } else if (activeTab === "리뷰") {
            path = `/movies/view/${data.movie_code}`;
        } else if (activeTab === "QnA") {
            path = `/qna/view/${data.no}`;
            navigate(path, { state: { result: 1 } });
            return;
        }
        navigate(path);
    };

    const [likeStatus, setLikeStatus] = useState(Array(5).fill(true));

    const toggleLike = async (index, community) => {
        console.log(index, community);
        const previousLikeStatus = [...likeStatus];

        // 먼저 로컬에서 좋아요 상태를 토글하여 사용자에게 즉각적인 피드백 제공
        const updatedLikeStatus = [...likeStatus];
        updatedLikeStatus[index] = !updatedLikeStatus[index];
        setLikeStatus(updatedLikeStatus);

        try {
            // 서버에 요청을 보내서 좋아요 상태 변경
            const response = await axios.get('http://localhost:9988/community/like/status', {
                params: { community_no: community.no }
            });
        } catch (error) {
            console.error('Error toggling like:', error);
            
            // 오류가 발생할 경우 이전 상태로 되돌리기
            setLikeStatus(previousLikeStatus);
        }
    };
    const toggledelete = async (info, type, subtype) => {
        console.log(info, type, subtype);
        if(info.type == "reply"){
            console.log("reply :", info.type);
        }
        else{
            console.log(info.type);
        }
        let params = {};
    
        // type에 따라 params 값 설정
        if (type === "qna") {
            params = { no: info.no };
        } else if (type === "community") {
            if(info.type == "reply"){
                params = {no : info.reply_no, subtype : info.type};
            }else if(info.type == "comment"){
                params = {no : info.reply_no, subtype : info.type};
            }else{
                params = { no: info.no, subtype : info.type};
            }
        } else if (type === "review") {
            params = { no: info.movie_review_no };
        }
        console.log("hi : ",params);
    
        try {
            const response = await axios.get(`http://localhost:9988/user/del/${type}`, {
                params: params
            });
    
            if (response.status === 200) {
                console.log('삭제 성공:', response.data);
                const englishTab = tabNames[activeTab];
                const sortColumn = tabData[activeTab].send[tabData[activeTab].display.indexOf(activeSubButton)];
                const engorder = sortOrder === 1 ? "desc" : "asc";
                fetchData(englishTab, sortColumn, engorder, searchType, searchKeyword);
            } else {
                alert("삭제 실패");
                console.log('삭제 실패:', response.data);
            }
        
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.error('서버 에러:', error.response.data);
            } else if (error.response && error.response.status === 400) {
                if (error.response.data === "Need login") {
                    console.log("로그인 필요, 로그인 페이지로 이동");
                    window.location.href = "/signin";
                } else {
                    console.error('잘못된 요청:', error.response.data);
                }
            } else {
                console.error('알 수 없는 오류:', error.message);
            }
        }
    
    };


    // 페이지네이션 영역
    
        //페이지네이션 이동 함수
        const handlePageChange = (newPage) => {
            setNowPage(newPage);
            //fetchData(tabNames[activeTab], tabData[activeTab].send[tabData[activeTab].display.indexOf(activeSubButton)], sortOrder === 1 ? "desc" : "asc", searchType, searchKeyword);
        };
            //페이지네이션 5개만 띄우기
    const PAGE_GROUP_SIZE = 5;

    // 페이지네이션 최대 5개일 때의 시작 페이지와 끝페이지 계산 후 리턴
    const getPageGroup = () => {
        const startPage = Math.floor((nowPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
        const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPage);
        return { startPage, endPage };
      };

    //계산한 시작페이지와 끝 페이지 반환
    const { startPage, endPage } = getPageGroup();
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
                    <div className={`filterbutton active-${activeTab}`}>
                        <div className="tabs">
                            {tabs.map((tab) => (
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
                            <div>
                            {tabData[activeTab].display.map((button, index) => (
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
                                <select className="dropdown" value={searchType} onChange={handleSearchTypeChange}>
                                    <option value="title">{activeTab === "리뷰" ? "영화" : activeTab === "QnA" ? "질문" : "제목"}</option>
                                    {activeTab === "게시글" && <option value="usernick">작성자</option>}
                                    <option value="content">내용</option>
                                </select>
                                <input type="text" placeholder="검색어 입력" className="search-input" value={searchKeyword} onChange={handleSearchKeywordChange} onKeyDown={(e) => { if (e.key === "Enter") { handleSearchClick();} }}/>
                                <button className="search-button" onClick={handleSearchClick}>검색</button>
                            </div>
                        </div>

                        

                    </div>

                    <div style={{width:"100%", display:'flex', justifyContent:"center"}}>
                        <table className="table table-dark table-hover">
                            <thead>
                                {headers[activeTab].map((header, index) => (
                                <th key={index} className={`col-md-${header.col}`}>{header.name}</th>
                            ))}
                            </thead>
                            <tbody>
                                {sortedData && sortedData.length > 0 ? (
                                    sortedData.map((data, index) => (
                                        <tr key={index} onClick={() => handleRowClick(data)} style={{ cursor: "pointer" }}>
                                            <td className="col-md-1">{data.no || "N/A"}</td>
                                            <td className="col-md-3">
                                            {activeTab === "QnA" 
                                                ? `[${data.head_title == 1 ? "영화" : (data.head_title == 2 ? "사이트" : "기타")}] ${data.title || "N/A"}`
                                                : data.title || "N/A"}
                                            </td>
                                            <td className="col-md-3">
                                                <div style={{ height: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} dangerouslySetInnerHTML={{ __html: data.content || "N/A" }} />
                                            </td>
                                            <td className="col-md-2">
                                                {activeTab === "게시글" && (data.usernick || "N/A")}
                                                {activeTab === "리뷰" && (data.rate || "N/A")}
                                                {activeTab === "QnA" && (data.qna_state == 1 ? "답변 됨" : "답변 없음" || "N/A")}
                                            </td>
                                            <td className="col-md-2">{data.writedate || "N/A"}</td>
                                            <td className="col-md-1" onClick={(e) => e.stopPropagation()}> {/* 상위 tr의 클릭 이벤트 전파 방지 */}
                                                {activeTab === "게시글" && activeSubButton === "좋아요" ? (
                                                    likeStatus[index] ? (
                                                        <FaHeart
                                                            onClick={(event) => {
                                                                event.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 방지
                                                                toggleLike(index, data);
                                                            }}
                                                        />
                                                    ) : (
                                                        <FaRegHeart
                                                            onClick={(event) => {
                                                                event.stopPropagation(); // 클릭 이벤트가 상위 요소로 전파되지 않도록 방지
                                                                toggleLike(index, data);
                                                            }}
                                                        />
                                                    )
                                                ) : (
                                                    
                                                      <FaTrashCan onClick={() => {toggledelete(data, tabNames[activeTab], tabData[activeTab].send[tabData[activeTab].display.indexOf(activeSubButton)])}} />
                                                    
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center" }}>
                                            게시글이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* 페이지네이션 */}
                <div className = "pagination">
                    <button className="paging-btn"
                    onClick={() => handlePageChange(1)} //맨처음 페이지로 이동
                    disabled={nowPage === 1 || totalPage === 1}> 
                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </button>

                    <button className="paging-btn"
                    onClick={() => handlePageChange(nowPage - 1)}//1페이지 전으로 이동
                    disabled={nowPage === 1 || totalPage === 1}>
                    <FaChevronLeft />
                    </button>

                    {/* 페이지 배열 */}
                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                    const pageNumber = startPage + index;
                    return (
                        <button className="paging-btn-num"
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={nowPage === pageNumber}
                        >
                        {pageNumber}
                        </button>
                    );
                    })}

                    <button className="paging-btn"
                    onClick={() => handlePageChange(nowPage + 1)} //1페이지 후로 이동
                    disabled={nowPage === totalPage || totalPage === 1}>
                    <FaChevronRight />
                    </button>

                    <button className="paging-btn"
                    onClick={() => handlePageChange(totalPage)} //맨 끝 페이지로 이동
                    disabled={nowPage === totalPage || totalPage === 1}>
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>

                </div>

            </div>
        </div>
    );
}

export default MyPost;
