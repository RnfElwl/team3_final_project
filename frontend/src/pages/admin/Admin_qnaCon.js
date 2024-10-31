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
    const [checkedQnas, setCheckedQnas] = useState(new Array(QnA.length).fill(false));
    const [editActive_state, setEditActive_state] = useState('1');
    const navigate = useNavigate();
    const result=1;
    //전체페이지
    const totalPage = Math.ceil(totalRecord / 12);
    //페이지네이션
    const handlePageChange = (newPage) => {
        setNowPage(newPage);
    };

    const handlesearchKeyChange = (e) => { //검색키 처리
        setSearchKey(e.target.value);
    };
    const handlesearchWordChange = (e) => { //검색 처리
        setSearchWord(e.target.value);
    };
    const handleActive_StateChange = (e) => {
        setEditActive_state(e.target.value);
    }

    useEffect(() => {
        console.log("현재 페이지:", nowPage);

        axios.get(`http://localhost:9988/admin/qnaList?nowPage=${nowPage}&searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
    }, [nowPage, searchKey, searchWord]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setNowPage(1);

        axios.get(`http://localhost:9988/admin/qnaList?nowPage=1&searchKey=${searchKey}&searchWord=${searchWord}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
                console.log("검색키:" + searchKey + ",검색어:" + searchWord);

            })
            .catch(error => {
                console.error("검색 중 오류 발생:", error);
            });
    };

    //삭제 체크  전체 관리
    const [isAllQnaChecked, setAllQnaChecked] = useState(false);
    //전체 체크 박스 클릭 시
    const handleAllQnaChecked = () => {
        const newCheckedState = !isAllQnaChecked;
        setAllQnaChecked(newCheckedState);
        setCheckedQnas(new Array(QnA.length).fill(newCheckedState)); // 모든 항목의 체크 상태를 동일하게 변경
    };

    const handleQnaChecked = (index) => {
        const newCheckedQnas = [...checkedQnas];
        newCheckedQnas[index] = !newCheckedQnas[index]; // 해당 항목의 체크 상태 변경
        setCheckedQnas(newCheckedQnas);

        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllQnaChecked(newCheckedQnas.every(item => item === true));
    };

    //useEffect를 사용하여 QnA 데이터가 변경될 때 체크 상태 초기화
    useEffect(() => {
        setCheckedQnas(new Array(QnA.length).fill(false)); // QnA 데이터 변경 시 체크 상태 초기화
        setAllQnaChecked(false); // 전체 체크박스 상태 초기화
    }, [QnA]);

    const editActiveStateSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        const selectedQnaNos = [];

        checkedQnas.forEach((isChecked, index) => {
            if (isChecked) {
                const qna_no = QnA[index]?.qna_no; // 체크된 항목의 qna_no를 가져옵니다.
                ;
                if (qna_no) {
                    formData.append('qna_no', qna_no); // qna_no를 폼 데이터에 추가합니다. 
                    selectedQnaNos.push(qna_no);          
                }
            }
        });
        formData.append('active_state', editActive_state);

        formData.forEach((value, key) => {
            console.log("키:", key, "값:", value);
        });

        console.log(formData);
        axios.post('http://localhost:9988/admin/qnaActiveEdit', formData)
            .then(response => {
                console.log('성공:', response.data);
                if (response.data === selectedQnaNos.length) {
                    handleSearchSubmit(e)
                }
            })
            .catch(error => {
                console.error('오류 발생:', error);
            });

    }


    //Qna 답글 팝업 창 열기
    const openAddQnaAnsWindow = (qna_no) => {
        window.open(`/admin/adminQAns/${qna_no}`, '_blank', 'width=600,height=584');
    };
    // //Qna 답글 수정 팝업 창 열기
    // const openEditQnaAnsWindow = (qna_no) => {
    //     window.open(`http://localhost:3000/admin/adminQAns/${qna_no}`, '_blank', 'width=600, height=584');
    // }

    //페이지네이션
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
        <div className="AdminQnaBody">
            <h3>QnA 관리</h3>
            <hr />
            <form className="adminQnaEdit" onSubmit={editActiveStateSubmit}>
                <div>
                    <div className="adminSearchForm">
                        <div>
                            <select
                                className="qnaSearchSelect"
                                name="searchKey"
                                value={searchKey}
                                onChange={handlesearchKeyChange}>
                                <option value="qna_title">제목</option>
                                <option value="qna_content">내용</option>
                                <option value="userid">작성자</option>
                                <option value="qna_no">번호</option>
                            </select>
                            <input
                                type="text"
                                name="searchWord"
                                className="qnaSearchWord"
                                onChange={handlesearchWordChange}
                                placeholder="Search..." />
                        </div>
                        <div className="qna_active_edit_form">
                            <select
                                value={editActive_state}
                                onChange={handleActive_StateChange}
                                className="qna_active_editopt"
                            >
                                <option value="1">활성</option>
                                <option value="0">비활성</option>
                            </select>
                            <button className="activeEditbtn" type="submit">저장</button>
                        </div>
                    </div>
                </div>
                <table className="table table-dark table-hover AdminQnaTable">
                    <thead>
                        <tr>
                            <th><input
                                type="checkbox"
                                checked={isAllQnaChecked}
                                onChange={handleAllQnaChecked}
                            />
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
                                    <td><input
                                        type="checkbox"
                                        checked={checkedQnas[index]}
                                        value={item?.qna_no || ''}
                                        onChange={() => handleQnaChecked(index)}
                                    />
                                    </td>
                                    <td>{item.qna_no}</td>
                                    <td>{item.userid}</td>
                                    <td>
                                        {item.head_title == 1 ? <span className="qna_ht">[영화]&nbsp;</span> :
                                            (item.head_title == 2 ? <span className="qna_ht">[사이트]&nbsp;</span> :
                                                <span className="qna_ht">[기타]&nbsp;</span>)}
                                            {item.privacyQ === 0 ?
                                                (<span className="qna_tableTitle"  
                                                    onClick={(e)=>navigate(`/qna/view/${item.qna_no}`,
                                                                { state: { privacyQ: item.privacyQ } })}>
                                                        {item.qna_title}</span>)
                                                : (<span
                                                    className="qna_tableTitle" 
                                                    onClick={(e) => {
                                                        const isConfirmed = window.confirm("해당 글은 비밀글입니다. 확인하시겠습니까?");
                                                        if (isConfirmed) {
                                                            navigate(`/qna/view/${item.qna_no}`, { state: { result: 1, privacyQ: item.privacyQ } });
                                                        } else {
                                                            e.preventDefault(); // 취소를 눌렀을 때 링크 이동을 막음
                                                        }
                                                    }}>
                                                    {item.qna_title}<AiFillLock /></span>)}       
                                    </td>
                                    <td>{item.qna_writedate}</td>
                                    <td>{item.active_state === 0 ? <div >비활성</div> : <div>활성</div>}</td>
                                    <td>{item.qna_state === 1 ?
                                        (<button className="qnaAnswerModify-btn"
                                            onClick={(e) => { e.preventDefault(); openAddQnaAnsWindow(item.qna_no); }}>답변 수정</button>)
                                        : (<button className="qnaAnswerAdd-btn"
                                            onClick={(e) => { e.preventDefault(); openAddQnaAnsWindow(item.qna_no); }}>답변 등록</button>)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">검색한 내용을 포함한 글이 존재하지 않습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </form>
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

export default QnaCon;