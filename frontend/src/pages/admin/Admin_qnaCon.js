import axios from "../../component/api/axiosApi";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillLock } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import $ from "jquery";

import './../../css/admin/adminQnaCon.css';

function QnaCon() {

    const [QnA, setQnA] = useState([]);
    const [nowPage, setNowPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchKey, setSearchKey] = useState('qna_title');
    const [searchWord, setSearchWord] = useState('');
    const navigate = useNavigate();
    const totalPage = Math.ceil(totalRecord / 12);
    const handlePageChange = (newPage) => {
        setNowPage(newPage);
    };

    const handlesearchKeyChange = (e) => { //검색키 처리
        setSearchKey(e.target.value);
    };
    const handlesearchWordChange = (e) => { //검색 처리
        setSearchWord(e.target.value);
    };

    useEffect(() => {
        //axios.get(`http://localhost:9988/qna/list?nowPage=${nowPage}`) 
        axios.get(`http://localhost:9988/admin/qnaCon/list?nowPage=${nowPage}&searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
    }, [nowPage]);

    //상태 검색
    if(searchKey==="active_state"){
        if (searchWord === "활성" || searchWord==="활") {
            setSearchWord("1");
        } else if (searchWord === "비활성" || searchWord==="비") {
            setSearchWord("0");
        } else if (searchWord === "수정됨" || searchWord==="수") {
            setSearchWord("2");
        }
    }
    //카테고리 검색
    if(searchKey==="qna_state"){
        if (searchWord === "유" || searchWord==="있음") {
            setSearchWord("1");
        } else if (searchWord === "무" || searchWord==="없음") {
            setSearchWord("0");
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setNowPage(1);

        axios.get(`http://localhost:9988/admin/qnaCon/list?nowPage=1&searchKey=${searchKey}&searchWord=${searchWord}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
                console.log("검색키:"+searchKey+",검색어:"+searchWord);
            })
            .catch(error => {
                console.error("검색 중 오류 발생:", error);
            });
    };

    //삭제 체크  전체 관리
    const [isAllQnaChecked, setAllQnaChecked] = useState(false);
    //삭제 체크 개별 관리
    const [checkedQnas, setCheckedQnas] = useState(
        new Array(QnA.length).fill(false) // QnA 항목 수만큼 false로 초기화
    );
    //전체 체크 박스 클릭 시
    const handleAllQnaChecked = () => {
        const newCheckedState = !isAllQnaChecked;
        setAllQnaChecked(newCheckedState);
        setCheckedQnas(new Array(QnA.length).fill(newCheckedState)); // 모든 항목의 체크 상태를 동일하게 변경
      };
    
      const handleQnaChecked = (index) => {
        const newCheckedQnas = [...checkedQnas];
        newCheckedQnas[index] = !newCheckedQnas[index];
        setCheckedQnas(newCheckedQnas);
    
        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllQnaChecked(newCheckedQnas.every(item => item === true));
      };

    //Qna 답글 팝업 창 열기
    const openAddQnaWindow = (e) => {
        e.preventDefault();
        window.open('http://localhost:3000/admin/', '_blank', 'width=600,height=400');
    };
      

    return (
        <div className="AdminQnaBody">
            <h3>QnA 관리</h3>
            <hr />
            <div className="adminSearchForm">
                <form onSubmit={handleSearchSubmit}>
                    <select
                        className="qnaSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}>
                        <option value="qna_title">제목</option>
                        <option value="qna_content">내용</option>
                        <option value="userid">작성자</option>
                        <option value="qna_no">번호</option>
                        <option value="active_state">상태</option>
                        <option value="qna_state">답변유무</option>
                    </select>
                    <div><input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />
                    <FaSearch
                        onClick={handleSearchSubmit}
                        size="30px"
                        style={{ cursor: 'pointer', color: 'rgb(0, 255, 156)' }} /></div>
                </form>
            </div>
            <form className="adminQnaEdit">
            <table className="table table-dark table-hover AdminQnaTable">
                <thead>
                    <tr>
                        <th><input
                            type="checkbox"
                            checked={isAllQnaChecked}
                            onChange={handleAllQnaChecked}/>
                        </th>
                        <th>No.</th>
                        <th>작성자</th>
                        <th>제목</th>
                        <th>등록일</th>
                        <th>상태</th>
                        <th>답변여부</th>
                    </tr>
                </thead>
                <tbody>
                    {QnA.length > 0 ? (
                        QnA.map((item, index) => (
                            <tr key={index}>
                                <th><input
                                    type="checkbox"
                                    checked={checkedQnas[index]}
                                    value={item.qna_no}
                                    onChange={() => handleQnaChecked(index)}/>
                                    </th>
                                <th>{item.qna_no}</th>
                                <th>{item.userid}</th>
                                <th className="adqna_ht_th">
                                    {item.head_title == 1 ? <div className="qna_ht">[상품]&nbsp;</div> :
                                        (item.head_title == 2 ? <div className="qna_ht">[사이트]&nbsp;</div> :
                                            <div className="qna_ht">[기타]&nbsp;</div>)}
                                    {item.privacyQ === 0 ?
                                        (<Link to={`/qna/view/${item.qna_no}`}>{item.qna_title}</Link>)
                                        : (<Link to={`/qna/view/${item.qna_no}`} onClick={()=>window.confirm("해당 글은 비밀글입니다. 확인하시겠습니까?")}>
                                            {item.qna_title}<AiFillLock /></Link>)}
                                </th>
                                <th>{item.qna_writedate}</th>
                                <th>{item.active_state === 0 ? <div>비활성</div>:<div>활성</div>}</th>
                                <th>{item.qna_state === 1 ? 
                                    (<button className="qnaAnswerModify-btn" onClick={openAddQnaWindow}>답변 수정</button>)
                                    :(<button className="qnaAnswerAdd-btn">답변 등록</button>)}</th>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">검색한 내용을 포함한 글이 존재하지 않습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* 페이지네이션 */}
            <div className="qna_pagination">
                <button className="paging-btn"
                    onClick={() => handlePageChange(1)} // 맨 처음 페이지로 가는 버튼
                    disabled={nowPage === 1 || totalPage === 1}>
                    <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button className="paging-btn"
                    onClick={() => handlePageChange(nowPage - 1)}
                    disabled={nowPage === 1 || totalPage === 1}>
                    <FaChevronLeft />
                </button>

                {totalPage === 1 ? (
                    <button className="paging-btn" disabled>{1}</button>
                ) : (
                    Array.from({ length: totalPage }, (_, index) => (
                        <button className="paging-btn"
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            disabled={nowPage === index + 1}
                        >
                            {index + 1}
                        </button>
                    ))
                )}

                <button className="paging-btn"
                    onClick={() => handlePageChange(nowPage + 1)}
                    disabled={nowPage === totalPage || totalPage === 1}>
                    <FaChevronRight />
                </button>
                <button className="paging-btn"
                    onClick={() => handlePageChange(totalPage)}
                    disabled={nowPage === totalPage || totalPage === 1}>
                    <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
            </div>
            </form>
        </div>
    );
}

export default QnaCon;