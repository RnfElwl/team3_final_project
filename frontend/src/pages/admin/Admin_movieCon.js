import './../../css/admin/adminMovCon.css'

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsExclamationCircle } from "react-icons/bs";
import axios from '../../component/api/axiosApi';
import Modal from '../../component/api/Modal';


function AdminMovieCon(){
    const [movie, setMovie]=useState([]);
    const [word, setWord] = useState('');
    const [searchKey, setSearchKey] =useState('movie_no');
    const [checkedMovie, setCheckedMovie] = useState(new Array(movie.length).fill(false));
    const [editActive_state, setEditActive_state]=useState('1');
    const [isAllMovieChecked, setAllMovieChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [modalTitle, setModalTitle] = useState("");
    const handleAllMovieChecked = () => {
        const newCheckedState = !isAllMovieChecked;
        setAllMovieChecked(newCheckedState);
        setCheckedMovie(new Array(movie.length).fill(newCheckedState));  
      };

      const handleMovieChecked = (index) => {
        const newCheckedMovie = [...checkedMovie];
        newCheckedMovie[index] = !newCheckedMovie[index]; // 해당 항목의 체크 상태 변경
        setCheckedMovie(newCheckedMovie);

        // 모든 항목이 체크되었는지 확인하여 전체 체크박스 상태 동기화
        setAllMovieChecked(newCheckedMovie.every(item => item === true));
    };  
    useEffect(()=>{
        getMovieList();
    }, []);

    const editActiveStateSubmit = (e) => {
        e.preventDefault();

        const formData =new FormData();

        checkedMovie.forEach((isChecked, index) => {
            if (isChecked) {
                console.log(index);
                const movie_no = movie[index]?.movie_no; // 체크된 항목의 qna_no를 가져옵니다.
                if (movie_no) {
                    formData.append('movie_no', movie_no); // qna_no를 폼 데이터에 추가합니다.           
                }
            }
        });
        
        formData.append('active_state',editActive_state);

        // formData.forEach((value, key) => {
        //     console.log("키:",key,"값: "+value);
        // });
        axios.post('http://localhost:9988/admin/movieActiveEdit', formData)
            .then(response => {
                console.log('성공:', response.data); 
                if (response.data >= 1) {
                    getMovieList();
                }
            })
            .catch(error => {
                console.error('오류 발생:', error);
            });
      }

    useEffect(() => {
        setCheckedMovie(new Array(movie.length).fill(false)); // QnA 데이터 변경 시 체크 상태 초기화
        setAllMovieChecked(false); // 전체 체크박스 상태 초기화
    }, [movie]);

    const handleActive_StateChange=(e)=>{
        setEditActive_state(e.target.value);
    }
    async function getMovieList(){
        try{
            const {data} = await axios.get(`http://localhost:9988/admin/movieList`, {params:{
                searchKey,
                word
            }});
            setMovie(data);
        }catch(e){
            console.log(e);
        }
    }
    const handlesearchKeyChange = (e) => { //검색키 처리
        console.log(e.target.value)
        setSearchKey(e.target.value);
    };
    function submitData(e){
        e.preventDefault();
        getMovieList();
    }
    function handlesearchWordChange(e){
        setWord(e.target.value);
    }
    return(
        <div className="AdminMovBody">
            <h3>영화 관리</h3>
    <hr />
    <div>
        영화 필터 폼
        <div className="member-filterArea">
            <div className="adminSearchForm">
                <form onSubmit={submitData}>
                    <select
                        className="MemSearchSelect"
                        name="searchKey"
                        value={searchKey}
                        onChange={handlesearchKeyChange}
                        >
                        <option value="movie_no">영화 번호</option>
                        <option value="movie_title">영화 제목</option>
                        <option value="movie_nation">국가</option>
                        <option value="opened_year">연도별</option>
                        <option value="movie_genre">장르</option>
                        <option value="movie_grade">관람등급</option>
                    </select>
                    <input
                        type="text"
                        name="searchWord"
                        className="qnaSearchWord"
                        onChange={handlesearchWordChange}
                        placeholder="Search..." />
                </form>
            </div>    
        </div>
        {isModalOpen && (
                        <Modal onClose={() => setIsModalOpen(false)} title={modalTitle}>
                        {1===1?
                        <>
                        </>
                        : (
                            <div className="noslide no-hover" style = {{height : "300px", marginTop : '20px'}}>
                                <BsExclamationCircle />
                                <p>{modalTitle}이 없습니다.</p>
                            </div>
                        )}
                    </Modal>
                        )}
        <form className="adminQnaEdit" onSubmit={editActiveStateSubmit} >
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
            <table className="table table-dark table-hover AdminMemTable">
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox"
                            checked={isAllMovieChecked}
                            onChange={handleAllMovieChecked}
                            />
                        </th>
                        <th>영화번호</th>
                        <th>영화제목(한글)</th>
                        <th>영화제목(영어)</th>
                        <th>타입</th>
                        <th>장르</th>
                        <th>국가</th>
                        <th>러닝타임</th>
                        <th>개봉년도</th>
                        <th>관람등급</th>
                        <th>조회수</th>
                        <th>수정날짜</th>
                        {/* <th>수정여부</th> */}
                        <th>수정유저</th>
                        <th>활성화</th>
                    </tr>
                </thead>
                <tbody>
                    {movie && movie.length > 0 ? (
                       movie.map((item, index)=>(
                        <tr>
                            <td>
                            <input type="checkbox"
                                checked={checkedMovie[index]}
                                value={item?.userid || ''}
                                onChange={() => handleMovieChecked(index)}
                            />
                            </td>
                            <td>{item.movie_no}</td>
                            <td>{item.movie_kor}</td>
                            <td>{item.movie_eng}</td>
                            <td>{item.movie_type}</td>
                            <td>{item.movie_genre}</td>
                            <td>{item.movie_nation}</td>
                            <td>{item.movie_showtime}</td>
                            <td>{item.opened_year}</td>
                            <td>{item.movie_grade}</td>
                            <td>{item.hit}</td>
                            <td>{item.edit_date}</td>
                            {/* <td>{item.edit_state}</td> */}
                            <td>{item.edit_user}</td>
                            <td>{item.active_state}</td>

                        </tr>
                       ))
                    ) : (
                        <tr className="no-results">
                            <td colSpan="16">검색한 내용을 포함한 영화가 존재하지 않습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </form>
    </div>
        </div>
    )
}

export default AdminMovieCon