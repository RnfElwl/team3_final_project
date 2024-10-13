import React, { useEffect, useState } from 'react';
import {useParams, useLocation } from 'react-router-dom';
import './../../css/movies/MovieView.css';
import { FaStar, FaRegBookmark, FaShareAlt } from 'react-icons/fa'; // 별 아이콘을 위해 react-icons 사용
import axios from 'axios';

function MovieView() {
  
  // 더미 리뷰 데이터
  const [reviews, setReviews] = useState([
  {
    id: 1,
    profileImg: 'https://via.placeholder.com/50', // 유저 프로필 이미지 (더미)
    nickname: 'User1',
    rating: 4,
    review: '정말 감동적인 영화였어요!',
  },
  {
    id: 2,
    profileImg: 'https://via.placeholder.com/50', // 유저 프로필 이미지 (더미)
    nickname: 'User2',
    rating: 5,
    review: '다섯 번은 더 보고 싶은 영화!',
  },
  {
    id: 3,
    profileImg: 'https://via.placeholder.com/50', // 유저 프로필 이미지 (더미)
    nickname: 'User3',
    rating: 3,
    review: '그냥 그랬어요...',
  },
]);


const { movieCode } = useParams(); // URL 파라미터에서 movie_code 가져옴
console.log(movieCode);
const [movie, setMovie] = useState(null); // 영화 데이터를 저장할 상태
const [loading, setLoading] = useState(true); // 로딩 상태
const [images, setImages] = useState([]);  // 이미지 목록 상태
const [rating, setRating] = useState(0); // 별점 상태
const [hoverRating, setHoverRating] = useState(0); // 마우스 호버 상태 추가
const [reviewText, setReviewText] = useState(''); // 한줄평 상태
const [isFavorite, setIsFavorite] = useState(false); // 찜하기 상태 추가
const location = useLocation(); // 현재 경로 가져오기 위해 사용
const userid = 'goguma1234';

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true); // 로딩 상태 시작
      try {
        // 영화 정보 가져오기
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}`);
        console.log(response.data); // API 응답 데이터 콘솔에 출력
        setMovie(response.data); // 영화 데이터를 상태에 저장

        // 영화 이미지 정보 가져오기
        // 이미지 정보 가져오기
        const imageResponse = await axios.get(`http://localhost:9988/api/movies/${movieCode}/images`);
        setImages(imageResponse.data);

        
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
    fetchMovie();
  }, [movieCode]);

  if (loading) return <div>Loading...</div>; // 로딩 중일 때 표시
  if (!movie) return <div>No movie data available</div>; // 데이터가 없을 때 표시

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // 여기서 서버로 찜하기 상태를 저장하거나 업데이트하는 API 호출 로직 추가 가능
    console.log(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${location.pathname}`;
    if (navigator.share) {
      navigator.share({
        title: movie.movie_kor,
        text: `${movie.movie_kor} - 지금 바로 확인하세요!`,
        url: shareUrl,
      })
      .then(() => console.log('Successfully shared'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      // Web Share API를 지원하지 않는 브라우저에서는 링크를 클립보드에 복사
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
      });
    }
  }
  
  const handleReviewSubmit = () => {
    if (rating > 0 && reviewText) {
      const newReview = {
        id: reviews.length + 1,
        profileImg: 'https://via.placeholder.com/50', // 기본 프로필 이미지
        nickname: userid, // 임시로 userid 사용
        rating,
        review: reviewText,
      };
      setReviews([newReview, ...reviews]); // 최신 리뷰를 리스트 상단에 추가
      setRating(0); // 평점 초기화
      setReviewText(''); // 리뷰 텍스트 초기화
    }
  };


    // 리뷰 컴포넌트
    const renderReviews = () => {
      return reviews.map((review) => (
        <div key={review.id} className="review">
          <img src={review.profileImg} alt="User profile" className="profile-img" />
          <div className="review-content">
            <div className="review-header">
              <span className="nickname">{review.nickname}</span>
              <div className="rating">
                {[...Array(5)].map((star, i) => (
                  <FaStar key={i} className={i < review.rating ? 'star active' : 'star'} />
                ))}
              </div>
            </div>
            <p className="review-text">{review.review}</p>
          </div>
        </div>
      ));
    };

    const formattedCasts = movie.movie_casts.replace(/\//g, ', ');

    return (
        <div className="movie-view-container">
          <div className="movie-content">
            <div className="contents-box">
              <div className="movie-image">
                <img src={movie.movie_link} alt={movie.movie_kor} />
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
                        <span>| {movie.opened_year}년</span> {/* 개봉년도 */}
                        <span>| {movie.movie_showtime}분</span> {/* 러닝타임 */}
                        <span>| {movie.movie_grade}</span> {/* 관람등급 */}
                    </div>
                    {/* 시놉시스 */}
                    <div className="info-synops">
                      {movie.movie_synops}
                    </div>
                </div>

                <div className="movie-actions">
                  {/* 찜하기 */}
                  <FaRegBookmark
                    className={`favorite-icon ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    title={isFavorite ? '북마크 해제' : '북마크'}
                  />
                  {/* 공유하기 */}
                  <FaShareAlt
                  className="share-icon"
                  onClick={handleShare}
                  title="공유하기" // 마우스 오버 시 설명
                />
                </div>
              </div>
              
            </div>

        <div className="watch-button-container">
            <button className="watch-btn">보러가기</button>
        </div>
        <hr/>
        
        <div className="tab-content">
          <div className="movie-details-info">
                            
              {/* 출연진 */}
              <div className="info-section">
                <h3>출연진</h3>
                <p>{formattedCasts}</p>
              </div>

              {/* 감독 */}
              <div className="info-section">
                <h3>감독</h3>
                <p>{movie.movie_directors}</p>
              </div>

            </div>
        </div>

        {/* 이미지 표시 섹션 */}
        <div className="image-gallery">
          <h3>관련 이미지</h3>
          <div className="image-row">
            {images.slice(0, 3).map((img, index) => (
              <img key={index} src={img} alt={`관련 이미지 ${index + 1}`} className="gallery-image" />
            ))}
          </div>
        </div>

        {/* 사용자 평 섹션 */}
        <div className="review-section">
        <div className="review-header">
            <h2><b>'{movie.movie_kor}'</b>의 사용자 평</h2>
          </div>
          {/* 리뷰 입력 필드 */}
        <div className="review-input-section">
          <div className="profile-section">
            <img src="https://via.placeholder.com/50" alt="Profile" className="profile-img" />
            <span className="nickname">{userid}</span>
          </div>
          <div className="rating-and-review">
            <div className="star-rating">
              {[...Array(5)].map((star, index) => (
                <FaStar
                key={index}
                className={`star ${index < (hoverRating || rating) ? 'active' : ''}`} // 호버 상태 반영
                onMouseEnter={() => setHoverRating(index + 1)} // 마우스 오버 시 별 색 채움
                onMouseLeave={() => setHoverRating(0)} // 마우스가 벗어날 때 초기화
                onClick={() => setRating(index + 1)} // 별 클릭 시 선택
                />
              ))}
            </div>
            <div
              contentEditable
              className="review-input"
              placeholder="한줄평을 남겨보세요"
              onInput={(e) => setReviewText(e.currentTarget.textContent)}
            >
              {reviewText}
            </div>
          </div>
          <button className="submit-btn" onClick={handleReviewSubmit}>
            등록
          </button>
        </div>
        {/* 리뷰 리스트 */}
        <div className="review-section">
          {renderReviews()}
        </div>

      </div>

        

      </div>  
    </div>
    );
}

export default MovieView;