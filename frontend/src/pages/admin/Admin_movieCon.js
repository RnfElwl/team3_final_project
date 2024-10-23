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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("영화 수정 폼");
    const [editForm, setEditForm] = useState({});
    const [clickNo, setClickNo] = useState();
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

    async function editBtnClick(no){
        try{
            const {data} = await axios.get(`http://localhost:9988/api/movies/${no}`);
            setEditForm(data.movieVO);
        }catch(e){
            console.log(e);
        }
        setIsModalOpen(true);
    }
    async function setEditFormData(){
        
        
    }
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

    function changeEditForm(e){
        let idField = e.target.name;
        let idValue = e.target.value;
        setEditForm((p)=>{return {...p, [idField]:idValue}});
        console.log(editForm);
    }
    async function updateEditForm(e){
        e.preventDefault();
        console.log(editForm)
        try{

            const {data} = await axios.post("http://localhost:9988/admin/movie/edit", editForm ,{
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            if(data===1){
                setIsModalOpen(false);
                getMovieList();
            }
        }catch(e){
            console.log(e);
        }

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
                        <Modal onClose={() => setIsModalOpen(false)} title={modalTitle} className={"eidt_form"}>
                        {1===1?
                        <form onSubmit={updateEditForm}>
                            <div className='edit_input'>
                                <div className='edit_column movie_title'>
                                    <span>한글제목</span> <input type='text'name='movie_kor' value={editForm.movie_kor} onChange={changeEditForm}/>    
                                </div>
                                <div className='edit_column movie_title'>
                                    <span>영어제목</span> <input type='text' name='movie_eng' value={editForm.movie_eng} onChange={changeEditForm}/>    
                                </div>
                                <div className='edit_column mini_select'>
                                    <div>

                                    <span>타입</span> <select value={editForm.movie_type } name='movie_type' onChange={changeEditForm}>
                                                            <option value="장편">장편</option>
                                                            <option value="단편">단편</option>
                                                        </select>    
                                    </div>
                                    <div>

                                    <span>장르</span> <select value={editForm.movie_genre} name='movie_genre' onChange={changeEditForm}>
                                                            <option value="드라마">드라마</option>
                                                            <option value="로맨스">로맨스</option>
                                                            <option value="액션">액션</option>
                                                            <option value="다큐멘터리">다큐멘터리</option>
                                                            <option value="애니메이션">애니메이션</option>
                                                            <option value="범죄">범죄</option>
                                                            <option value="전쟁">전쟁</option>
                                                            <option value="어드벤처">어드벤처</option>
                                                            <option value="단편">판타지</option>
                                                            <option value="공포(호러)">공포(호러)</option>
                                                            <option value="사극">사극</option>
                                                            <option value="SF">SF</option>
                                                            <option value="미스터리">미스터리</option>
                                                            <option value="스릴러">스릴러</option>
                                                        </select>    
                                    </div>
                                    <div>

                                    <span>국가</span> <select value={editForm.movie_nation} name='movie_nation' onChange={changeEditForm}>
                                                            <option value="한국">한국</option>
                                                            <option value="중국">중국</option>
                                                            <option value="미국">미국</option>
                                                            <option value="영국">영국</option>
                                                            <option value="일본">일본</option>
                                                            <option value="스페인">스페인</option>
                                                            <option value="홍콩">홍콩</option>
                                                            <option value="대만">대만</option>
                                                            <option value="이탈리아">이탈리아</option>
                                                            <option value="덴마크">덴마크</option>
                                                            <option value="브라질">브라질</option>
                                                            <option value="독일">독일</option>
                                                            <option value="인도">인도</option>
                                                        </select>    
                                    </div>
                                </div>
                                <div className='edit_column'>
                                    <span>러닝타임</span> <input type='text' name='movie_showtime' value={editForm.movie_showtime} onChange={changeEditForm}/>    
                                </div>
                                <div className='edit_column'>
                                    <span>개봉년도</span> <input type='text' name='opened_year' value={editForm.opened_year} onChange={changeEditForm}/>    
                                </div>
                                <div className='edit_column'>
                                    <span>감독</span> <input type='text' name='movie_directors' value={editForm.movie_directors} onChange={changeEditForm}/>    
                                </div>
                                <div className='edit_column'>
                                    <span>관람등급</span> <select name='movie_grade' value={editForm.movie_grade} onChange={changeEditForm}>
                                                            <option value="전체관람가">전체관람가</option>
                                                            <option value="12세 미만인 자는 관람할 수 없는 등급">12세 미만인 자는 관람할 수 없는 등급</option>
                                                            <option value="12세관람가">12세관람가</option>
                                                            <option value="12세이상관람가">12세이상관람가</option>
                                                            <option value="15세 미만인 자는 관람할 수 없는 등급">15세 미만인 자는 관람할 수 없는 등급</option>
                                                            <option value="15세관람가">15세관람가</option>
                                                            <option value="18세관람가">18세관람가</option>
                                                            <option value="고등학생이상관람가">고등학생이상관람가</option>
                                                            <option value="연소자관람가">연소자관람가</option>
                                                            <option value="연소자관람불가">연소자관람불가</option>
                                                            <option value="중학생이상관람가">중학생이상관람가</option>
                                                            <option value="청소년관람불가">청소년관람불가</option>
                                                        </select>   
                                </div>
                                <div className='edit_column'>
                                    <span>설명글</span> <textarea name='movie_synops' value={editForm.movie_synops} onChange={changeEditForm}></textarea>    
                                </div>
                                <div className='edit_column casts'>
                                    <span>배우목록</span> <input type='text' name='movie_casts' value={editForm.movie_casts} onChange={changeEditForm}/>    
                                </div>

                            </div>
                            <button>수정하기</button>    
                        </form>
                        : (
                            <div className="noslide no-hover" style = {{height : "300px", marginTop : '20px'}}>
                                <BsExclamationCircle />
                                <p>{modalTitle}이 없습니다.</p>
                            </div>
                        )}
                    </Modal>
                        )}
        <form className="adminQnaEdit" onSubmit={editActiveStateSubmit} >
            <div className='active_box'>
                <select
                value={editActive_state}
                onChange={handleActive_StateChange}
                    >
                    <option value="1">활성</option>
                    <option value="0">비활성</option>
                </select>
                <button type="submit">저장</button>
            </div>
            <table className="table table-dark table-hover AdminMovieTable">
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
                        <th>수정유저</th>
                        <th>활성화</th>
                        <th>수정</th>
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
                            <td><button type="button" onClick={()=>editBtnClick(item.movie_code)}>수정하기</button></td>
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