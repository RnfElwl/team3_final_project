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
    const [editActive_state, setEditActive_state]=useState('1');
    const navigate = useNavigate();
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
    const handleActive_StateChange=(e)=>{
        setEditActive_state(e.target.value);
    }

    useEffect(() => {
        console.log("현재 페이지:", nowPage);

        axios.get(`http://localhost:9988/admin/qnaCon/list?nowPage=${nowPage}&searchKey=${searchKey}&searchWord=${decodeURIComponent(searchWord)}`)
            .then(response => {
                console.log(response.data);
                setQnA(response.data.qnaList);
                setTotalRecord(response.data.qnaTotalPages);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
            //함수 안에서 ip및 get요청 보낸 시간 구하는 거
            const res = axios.get('https://geolocation-db.com/json/')
            .then((res) => {
                // get 요청이 끝나서 주어진 ISO 8601 날짜 문자열
                const endTime = new Date();
                
                // Date 객체로 변환
                const date = new Date(endTime);

                // 한국 시간으로 변환
                const options = {
                    timeZone: 'Asia/Seoul',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false // 24시간 형식
                };

                const formatter = new Intl.DateTimeFormat('ko-KR', options);
                const koreanDateString = formatter.format(date);

                
                console.log("data : ", res, "요청 완료 시간:", endTime.toISOString())
                console.log("한국 시간:", koreanDateString);

            })
    }, [nowPage, searchKey,searchWord]);

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

        const formData =new FormData();

        checkedQnas.forEach((isChecked, index) => {
            if (isChecked) {
                const qna_no = QnA[index]?.qna_no; // 체크된 항목의 qna_no를 가져옵니다.
                ; 
                if (qna_no) {
                    formData.append('qna_no', qna_no); // qna_no를 폼 데이터에 추가합니다.           
                }
            }
        });
        formData.append('active_state',editActive_state);

        formData.forEach((value, key) => {
            console.log("키:",key,"값:",value);
        });

        console.log(formData);
        axios.post('http://localhost:9988/admin/qnaActiveEdit', formData)
            .then(response => {
                console.log('성공:', response.data);
            })
            .catch(error => {
                console.error('오류 발생:', error);
            });

      }


    //Qna 답글 팝업 창 열기
    const openAddQnaAnsWindow = (qna_no) => {
        window.open(`http://localhost:3000/admin/adminQAns/${qna_no}`, '_blank', 'width=600,height=584');
    };
    //Qna 답글 수정 팝업 창 열기
    const openEditQnaAnsWindow = (qna_no)=>{
        window.open(`http://localhost:3000/admin/adminQAns/${qna_no}`,'_blank','width=600, height=584');
    }
      
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
            <form className="adminQnaEdit" onSubmit={editActiveStateSubmit}>
                <div>              
                    <select
                    value={editActive_state}
                    onChange={handleActive_StateChange}
                    >
                        <option value="1">활성</option>
                        <option value="0">비활성</option>
                    </select>
                    <button type="submit">저장</button>
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
                                <th><input
                                    type="checkbox"
                                    checked={checkedQnas[index]}
                                    value={item?.qna_no|| ''}
                                    onChange={() => handleQnaChecked(index)}
                                    />
                                    </th>
                                <th>{item.qna_no}</th>
                                <th>{item.userid}</th>
                                <th className="adqna_ht_th">
                                    {item.head_title == 1 ? <div className="qna_ht">[영화]&nbsp;</div> :
                                        (item.head_title == 2 ? <div className="qna_ht">[사이트]&nbsp;</div> :
                                            <div className="qna_ht">[기타]&nbsp;</div>)}
                                    {item.privacyQ === 0 ?
                                        (<Link to={`/qna/view/${item.qna_no}`}>{item.qna_title}</Link>)
                                        : (<Link to={`/qna/view/${item.qna_no}`}
                                            onClick={(e) => {
                                                const isConfirmed = window.confirm("해당 글은 비밀글입니다. 확인하시겠습니까?");
                                                if (!isConfirmed) {
                                                  e.preventDefault();  // 취소를 눌렀을 때 링크 이동을 막음
                                                }
                                              }}>
                                            {item.qna_title}<AiFillLock /></Link>)}
                                </th>
                                <th>{item.qna_writedate}</th>
                                <th>{item.active_state === 0 ? <div>비활성</div>:<div>활성</div>}</th>
                                <th>{item.qna_state === 1 ? 
                                    (<button className="qnaAnswerModify-btn"
                                        onClick={(e)=>{e.preventDefault(); openEditQnaAnsWindow(item.qna_no);}}>답변 수정</button>)
                                    :(<button className="qnaAnswerAdd-btn"
                                        onClick={(e)=>{e.preventDefault(); openAddQnaAnsWindow(item.qna_no);}}>
                                            답변 등록</button>)}</th>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">검색한 내용을 포함한 글이 존재하지 않습니다.</td>
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