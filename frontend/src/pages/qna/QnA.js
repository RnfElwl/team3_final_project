import './../../css/qna/qna.css';
import React, { useState, useEffect } from 'react';
import axios from "../../component/api/axiosApi";
// import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { AiFillLock } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import qnaBack from '../../img/qnaBack.png'
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
    //전체페이지 계산
    const totalPage = Math.ceil(totalRecord / 12);
    //페이지네이션 이동 함수
    const handlePageChange = (newPage) => {
        setNowPage(newPage);
    };
    //게시글 정렬
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const [selectedCategory, setSelectedCategory] = useState('all');

    //말머리 필터
    const handleSearchClick = (e) => {
        e.preventDefault();
        const category = e.target.value;
        setSelectedCategory(category);
        setNowPage(1);
        const searchValue = e.target.value;
        setSearchKey('head_title');
        setSearchWord(searchValue); 
    };
    //전체 전환
    const handleSearchClickAll=(e)=>{
        e.preventDefault();
        setSelectedCategory('all');
        setNowPage(1);
        const searchValue=e.target.value;
        setSearchKey('head_title');
        setSearchWord('');
    }

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
    }, [nowPage, searchKey,searchWord]);
    
    //검색 시 데이터 요청
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setNowPage(1);
        axios.get(`http://localhost:9988/qna/list?nowPage=1&searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
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
            axios.post(`http://localhost:9988/qna/view/${privatePost.qna_no}`,
                {
                    qna_no: privatePost.qna_no,
                    privacyCheckWord: privatePost.qna_pwd
                })
            .then((response)=>{
                console.log(response.data);
                const result = response.data;

                if(response.data==1){
                    console.log(result);
                    // console.log(privatePost.qna_no);
                    navigate(`/qna/view/${privatePost.qna_no}`, { state: {result} });
                }
            }).catch((error)=>{
                console.error('인증 실패',error);
            });
        } else {
            const result = 0;
            alert("비밀번호가 틀렸습니다! 목록으로 되돌아갑니다.");
            navigate(`/qna/view/${privatePost.qna_no}`, { state: {result} });
            
            // setIsPasswordCheck(false);
        }
    };
    const handlesearchKeyChange = (e) => { //검색키 처리
        setSearchKey(e.target.value);
    };
    const handlesearchWordChange = (e) => { //검색 처리
        setSearchWord(e.target.value);
    };
    //테이블 정렬
    const sortedQnA = [...QnA].sort((a, b) => {
        if (sortConfig.key === null) {
            return 0; // 정렬할 항목이 없으면 그대로 반환
        }
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // 작성자 항목의 경우 마스킹된 부분을 제외하고 정렬
        if (sortConfig.key === 'userid') {
            aVal = a.userid.substring(0, 2) + a.userid.substring(2).replace(/./g, "*");
            bVal = b.userid.substring(0, 2) + b.userid.substring(2).replace(/./g, "*");
        }

        // qna_title 정렬 시 null 처리와 문자 비교
        if (sortConfig.key === 'qna_title') {
            aVal = a.qna_title || '';
            bVal = b.qna_title || '';
        }

        if (aVal < bVal) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
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
        <div className="QnABody">
            <div>
                <img src={qnaBack} style={{width:'1200px', height:'500px'}}/>
            </div>
            <div className="container mt-3">
                <h1>질의응답(QnA)</h1>
                <hr />
                <div className="totalRecord-info">
                    <div className="tr-right-info">전체 문의글 <div>&nbsp;{totalRecord}</div></div>
                    {/* 검색폼 */}
                    <div className="searchForm">
                        <form onSubmit={handleSearchSubmit}>
                            <select
                            className="qnaSearchSelect"
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
                                className="qnaSearchWord"
                                onChange={handlesearchWordChange}
                                placeholder="Search..."/>
                            <FaSearch
                                onClick={handleSearchSubmit}
                                size="30px"
                                style={{ cursor: 'pointer', color:'#48d1cdea' }} />
                        </form>
                    </div>
                </div>
                <div className="qna-category-filter">
                    <button value='all'
                        className={`qna-category-allSel ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={handleSearchClickAll}
                        disabled={selectedCategory === 'all'}> 전체</button>
                    <button value='1'
                        className={selectedCategory === '1' ? 'active' : ''}
                        onClick={handleSearchClick}
                        disabled={selectedCategory === '1'}>영화</button>
                    <button value='2'
                        className={selectedCategory === '2' ? 'active' : ''}
                        onClick={handleSearchClick}
                        disabled={selectedCategory === '2'}> 사이트</button>
                    <button value='3'
                        className={selectedCategory === '3' ? 'active' : ''}
                        onClick={handleSearchClick}
                        disabled={selectedCategory === '3'}> 기타</button>
                </div>
                <table className="table table-dark table-hover QnaTable">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('qna_no')}>No.</th>
                            <th onClick={() => requestSort('userid')}>작성자</th>
                            <th style={{display:"none"}}>카테고리</th>
                            <th onClick={() => requestSort('qna_title')}>제목</th>
                            <th onClick={() => requestSort('qna_writedate')}>등록일</th>
                            <th onClick={() => requestSort('qna_state')}>답변여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedQnA.length > 0 ? (
                            sortedQnA.map((item, index) => (
                                <tr key={index}>
                                    <th>{item.qna_no}</th>
                                    <th>{item.userid.substring(0, 2) + item.userid.substring(2).replace(/./g, "*")}</th>
                                    <th className="qna_ht_th">
                                        {item.head_title == 1 ? <div className="qna_ht">[영화]&nbsp;</div> :
                                            (item.head_title == 2 ? <div className="qna_ht">[사이트]&nbsp;</div> :
                                                <div className="qna_ht">[기타]&nbsp;</div>)}
                                        {item.privacyQ === 0 ? (
                                            <div onClick={() => navigate(`/qna/view/${item.qna_no}`, { state: { privacyQ: item.privacyQ } })} >{item.qna_title}</div>
                                            // <Link to={`/qna/view/${item.qna_no}`}>{item.qna_title}</Link>
                                        ) : (
                                            <div className="qna_pwt" onClick={() => handlePrivateClick(item)}>
                                                비밀글입니다. <AiFillLock />
                                            </div>
                                        )}
                                    </th>
                                    <th>{item.qna_writedate}</th>
                                    <th>{item.qna_state === 1 ? "답변됨" : "답변 없음"}</th>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">검색한 내용을 포함한 글이 존재하지 않습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="right-buttons write-buttons">
                    <button onClick={checkid}>문의 등록하기</button>
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
                                <input id="qna_password" type="password" name="userpwd" minLength='4' maxLength='20' value={password}
                                    onChange={handlePasswordChange} />
                                <button value="submit">입력</button>
                            </form>
                            <button onClick={closePrivateView}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
          

    {/* 페이지네이션 */}
    <div className="qna_pagination">
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
    );
}

export default QnA;
