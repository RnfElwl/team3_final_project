import React, { useEffect, useState } from 'react';
import {useParams } from 'react-router-dom';
import './../../css/movies/MovieView.css';
import { FaStar } from 'react-icons/fa'; // 별 아이콘을 위해 react-icons 사용
import axios from 'axios';

function MovieView() {
  const { movieCode } = useParams(); // URL 파라미터에서 type, genre, id 가져옴
  const [movie, setMovie] = useState(null); // 영화 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true); // 로딩 상태 시작
      try {
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}`);
        console.log(response.data); // API 응답 데이터 콘솔에 출력
        setMovie(response.data); // 영화 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
    fetchMovie();
  }, [movieCode]);

  if (loading) return <div>Loading...</div>; // 로딩 중일 때 표시

  if (!movie) return <div>No movie data available</div>; // 데이터가 없을 때 표시


    return (
        <div className="movie-view-container">
          <div className="movie-content">
            {/* 대표 이미지 */}
            <div className="movie-image">
                <img src="https://via.placeholder.com/1200x600" alt="Movie Poster" />
            </div>

            {/* 영화 제목과 버튼들 */}
            <div className="movie-details">
              <div className="movie-title">
                  <h1>{movie.movie_kor}</h1>
              </div>

              <div className="movie-info">
                  <div className="rating-info">
                      <FaStar className="star-icon" /> 4.5 (200) {/* 평균 평점과 평점 개수 */}
                  </div>
                  <div className="info-details">
                      <span>{movie.movie_genre}</span> {/* 장르 */}
                      <span>|  {movie.opened_year}</span> {/* 개봉년도 */}
                      <span>|  {movie.movie_showtime}분</span> {/* 러닝타임 */}
                      <span>|  {movie.movie_grade}</span> {/* 관람등급 */}
                  </div>
              </div>

        </div>
        <div className="movie-actions">
          <button className="action-btn">찜하기</button>
          <button className="action-btn">공유하기</button>
        </div>

        <div className="watch-button-container">
            <button className="watch-btn">보러가기</button>
        </div>


        
        <div className="tab-content">
          <div className="movie-details-info">
              {/* 시놉시스 */}
              <div className="info-section">
                <h3>시놉시스</h3>
                <p>영화에 대한 간략한 내용이 여기에 표시됩니다.</p>
              </div>
              
              {/* 장르 */}
              <div className="info-section">
                <h3>장르</h3>
                <div className="genre-buttons">
                  <button className="genre-btn">{movie.movie_genre}</button>
                </div>
              </div>
              
              {/* 출연진 */}
              <div className="info-section">
                <h3>출연진</h3>
                <p>배우1, 배우2, 배우3</p>
              </div>

              {/* 감독 */}
              <div className="info-section">
                <h3>감독</h3>
                <p>{movie.movie_directors}</p>
              </div>

              {/* 추가 정보 */}
              <div className="info-section">
                <h3>추가 정보</h3>
                <p>기타 내용이 여기에 표시됩니다.</p>
              </div>
            </div>

        </div>

        </div>  
    </div>
    );
}

export default MovieView;