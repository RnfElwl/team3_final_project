import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './../../css/movies/MovieList.css'; // CSS 파일을 임포트

function MovieList() {
  const { type, id } = useParams(); // URL 파라미터에서 type과 id 가져옴
  const [movies, setMovies] = useState([]); // 영화 리스트 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // Hook을 함수 컴포넌트 내부에서 호출

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = '';

        // API URL 설정: genre, year, nation에 따른 분기 처리
        if (type === 'genre') {
          url = `http://localhost:9988/api/movies/genre/${id}`; // 장르별 영화 데이터
        } else if (type === 'year') {
          url = `http://localhost:9988/api/movies/year/${id}`; // 연도별 영화 데이터
        } else if (type === 'nation') {
          url = `http://localhost:9988/api/movies/nation/${id}`; // 국가별 영화 데이터
        }

        const response = await axios.get(url); // axios로 GET 요청
        console.log('Fetched movies:', response.data); // 데이터를 콘솔에 출력
        
        setMovies(response.data); // 영화 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type, id]);

  // 영화 카드 클릭 시 상세 페이지로 이동하는 함수
  const handleCardClick = (movieCode) => {
    navigate(`/movies/view/${movieCode}`); // movieCode만 사용
  };

  // 로딩 중일 때
  if (loading) {
    return <div>Loading...</div>;
  }

  // 영화 리스트 렌더링
  return (
    <div className="movie-list-wrapper"> {/* 컨텐츠를 감싸는 중앙 배치용 div */}
      <div className="movie-list-container">
        <h2> {id} 영화 목록</h2>
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.movie_code} className="col-6 col-sm-4 col-md-2 mb-4">
              <div 
                className="movie-card"
                onClick={() => handleCardClick(movie.movie_code)} // 영화 카드 클릭 시 이동
                style={{ cursor: 'pointer' }} // 클릭할 수 있는 커서 스타일 추가
                >
                <img src={movie.movie_link} alt={movie.movie_kor} className="movie-poster" />
                <div className="movie-info">
                  <h5 className="movie-title">{movie.movie_kor}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
