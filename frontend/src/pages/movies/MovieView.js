import React, { useEffect, useState } from 'react';
import {useParams, useLocation } from 'react-router-dom';
import Slider from 'react-slick'; // react-slick 슬라이더 추가
import './../../css/movies/MovieView.css';
import { FaStar, FaHeart, FaShareAlt } from 'react-icons/fa'; // 별 아이콘을 위해 react-icons 사용
import axios from 'axios';

function MovieView() {

  
  // 더미 리뷰 데이터
  const dummyReviews = [
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
];

// 임의의 이미지 데이터
const dummyImages = [
  'https://via.placeholder.com/300x200?text=Image+1',
  'https://via.placeholder.com/300x200?text=Image+2',
  'https://via.placeholder.com/300x200?text=Image+3',
  'https://via.placeholder.com/300x200?text=Image+4',
  'https://via.placeholder.com/300x200?text=Image+5',
];


  const { movieCode } = useParams(); // URL 파라미터에서 type, genre, id 가져옴
  const [movie, setMovie] = useState(null); // 영화 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 상태
  const [rating, setRating] = useState(0); // 별점 상태
  const [reviewText, setReviewText] = useState(''); // 한줄평 상태
  const [isFavorite, setIsFavorite] = useState(false); // 찜하기 상태 추가
  const location = useLocation(); // 현재 경로 가져오기 위해 사용

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
    console.log("Rating:", rating);
    console.log("Review:", reviewText);
    // 여기서 서버로 평점과 한줄평을 제출할 로직 추가 가능
    setIsModalOpen(false); // 모달 창 닫기
  };

  // react-slick 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // 한 번에 표시할 이미지 수
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

    // 리뷰 컴포넌트
    const renderReviews = () => {
      return dummyReviews.map((review) => (
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
                        <span>|  {movie.opened_year}</span> {/* 개봉년도 */}
                        <span>|  {movie.movie_showtime}분</span> {/* 러닝타임 */}
                        <span>|  {movie.movie_grade}</span> {/* 관람등급 */}
                    </div>
                    {/* 시놉시스 */}
                    <div className="info-synops">
                      <p>{movie.movie_synops}</p>
                    </div>
                </div>

                <div className="movie-actions">
                  {/* 찜하기 */}
                <FaHeart
                  className={`favorite-icon ${isFavorite ? 'active' : ''}`}
                  onClick={toggleFavorite}
                  title={isFavorite ? '찜 해제' : '찜하기'}
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
                <p>{movie.movie_casts}</p>
              </div>

              {/* 감독 */}
              <div className="info-section">
                <h3>감독</h3>
                <p>{movie.movie_directors}</p>
              </div>

            </div>
        </div>

         {/* 이미지 슬라이드 섹션 */}
        <div className="image-slider">
          <h3>관련 이미지</h3>
          <Slider {...settings}>
            {dummyImages.map((image, index) => (
              <div key={index} className="image-slide">
                <img src={image} alt={`관련 이미지 ${index + 1}`} />
              </div>
            ))}
          </Slider>
        </div>
        <hr/>

        {/* 사용자 평 섹션 */}
        <div className="review-section">
        <div className="review-header">
            <h2>S# 사용자 평</h2>
            <button className="write-review-btn" onClick={() => setIsModalOpen(true)}>리뷰쓰기</button>
          </div>
          {renderReviews()}
        </div>

        {/* 모달 창 */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>평점 남기기</h3>
              <div className="star-rating">
                {[...Array(5)].map((star, index) => (
                  <FaStar
                    key={index}
                    className={index < rating ? 'star active' : 'star'}
                    onClick={() => setRating(index + 1)} // 클릭한 별까지 채우기
                  />
                ))}
              </div>
              <div className="review-input">
                <textarea
                  placeholder="한줄평을 남겨보세요"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </div>
              <button className="submit-btn" onClick={handleReviewSubmit}>
                등록
              </button>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                닫기
              </button>
            </div>
          </div>
        )}

        </div>  
    </div>
    );
}

export default MovieView;