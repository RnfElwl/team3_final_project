import React, { useEffect, useState, useRef } from 'react';
import {useParams, useLocation } from 'react-router-dom';
import './../../css/movies/MovieView.css';
import { FaStar, FaRegBookmark, FaShareAlt } from 'react-icons/fa'; // 별 아이콘을 위해 react-icons 사용
// import axios from 'axios';
import axios from '../../component/api/axiosApi';

function MovieView() {
  
  
  const [reviews, setReviews] = useState([]);
  const { movieCode } = useParams(); // URL 파라미터에서 movie_code 가져옴
  const [movie, setMovie] = useState(null); // 영화 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [images, setImages] = useState([]);  // 이미지 목록 상태
  const [rating, setRating] = useState(0); // 별점 상태
  const [hoverRating, setHoverRating] = useState(0); // 마우스 호버 상태 추가
  const [reviewText, setReviewText] = useState(''); // 한줄평 상태
  const [isFavorite, setIsFavorite] = useState(false); // 찜하기 상태 추가
  const location = useLocation(); // 현재 경로 가져오기 위해 사용
  const [userid, setUserId] = useState(null); // userid를 상태로 관리
  const [isEditing, setIsEditing] = useState(false); // 리뷰 수정 상태
  const [editReviewText, setEditReviewText] = useState(''); // 수정할 리뷰 내용 저장

  // Ref로 contentEditable 요소를 제어
  const reviewInputRef = useRef(null);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true); // 상태 추가

  // const isLoggedIn = !!userid; // 로그인 상태를 확인하는 코드 (userid가 있으면 true)



  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true); // 로딩 상태 시작
      try {
        // 영화 정보 가져오기
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}`);
        console.log(response.data); // API 응답 데이터 콘솔에 출력
        setMovie(response.data.movieVO); // 영화 데이터를 상태에 저장
        setUserId(response.data.userid);

        // 이미지 정보 가져오기
        const imageResponse = await axios.get(`http://localhost:9988/api/movies/${movieCode}/images`);
        setImages(imageResponse.data);

        
        // 리뷰 정보 가져오기
        const reviewResponse = await axios.get(`http://localhost:9988/api/reviews/${movieCode}`);
        console.log('Fetched reviews:', reviewResponse.data); // 리뷰 데이터 로그로 확인
        setReviews(reviewResponse.data); // 서버에서 가져온 리뷰 저장
        
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
    fetchMovie();
  }, [movieCode, userid]);

  // userid가 설정된 후에 북마크 상태를 가져오도록 useEffect 분리
  useEffect(() => {
    if (userid && movieCode) {
      const fetchBookmarkStatus = async () => {
        try {
          const bookmarkResponse = await axios.get(`http://localhost:9988/api/bookmarks/add/${movieCode}`);
          console.log(bookmarkResponse.data);
          setIsFavorite(bookmarkResponse.data.isFavorite); // 북마크 여부 설정
        } catch (error) {
          console.error("Error fetching bookmark status:", error);
        }
      };
      fetchBookmarkStatus();
    }
  }, [userid, movieCode]);



  if (loading) return <div>Loading...</div>; // 로딩 중일 때 표시
  if (!movie) return <div>No movie data available</div>; // 데이터가 없을 때 표시


  // 찜하기 토글 함수
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // 북마크 해제 API 호출
        const response = await axios.delete('http://localhost:9988/api/bookmarks/remove', {
          data: { userid, movie_no: movie.movie_no }
        });
        console.log(response.data); // 응답 상태 확인
        if (response.status === 200) {
          setIsFavorite(false);
        }
        
      } else {
        // 북마크 추가 API 호출
        const response = await axios.post('http://localhost:9988/api/bookmarks/add', {
          userid,
          movie_no: movie.movie_no
        
        });
        console.log(response.data); // 응답 데이터만 출력
        if (response.status === 200) {
          setIsFavorite(true);
        }
        console.log("success");
        }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };
  
  // 공유하기
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

  // 리뷰 제출 함수
  const handleReviewSubmit = async () => {
    console.log("Submitting review with userid:", userid);
    const reviewText = reviewInputRef.current.textContent; // 입력된 텍스트 가져오기
    if (rating > 0 && reviewText) {
      try {
        if (!userid) {
          console.error('User ID is missing');
          return;
        }
        // 리뷰 서버로 전송
        const response = await axios.post('/api/reviews/add', {
          userid,
          movie_no: movie.movie_no,
          movie_review_content: reviewText,
          rate: rating,
        });
        // 새로운 리뷰 추가 후 상태 업데이트
        setReviews([response.data, ...reviews]); // 최신 리뷰가 상단에 추가
        // 리뷰 입력 초기화
        reviewInputRef.current.textContent = ''; // 리뷰 입력 초기화
        setIsPlaceholderVisible(true); // placeholder 다시 표시
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };
  
    // 리뷰 컴포넌트
    // 리뷰 컴포넌트
    const renderReviews = () => {
      return reviews.map((review) => (
        <div key={review.id} className="review">
          <img src={review.profileImg} alt="User profile" className="profile-img" />
          <div className="review-content">
          {isEditing ? (
            <div>
              <textarea 
                value={editReviewText} 
                onChange={(e) => setEditReviewText(e.target.value)} 
                className="review-edit-input"
              />
              <button onClick={() => handleUpdateReview(review.id)}>저장</button>
              <button onClick={() => setIsEditing(false)}>취소</button>
            </div>
          ) : (
            <p className="review-text">{review.movie_review_content}</p>
          )}
            <div className="review-header">
              <span className="nickname">{review.userid}</span>
              <div className="rating">
                {[...Array(5)].map((star, i) => (
                  <FaStar key={i} className={i < review.rate ? 'star active' : 'star'} />
                ))}
                  </div>
                </div>
                <p className="review-text">{review.movie_review_content}</p>

                {/* 로그인된 사용자가 작성한 리뷰일 경우 수정/삭제 버튼을 표시 */}
                {review.userid === userid && (
                  <div className="review-actions">
                    <button onClick={() => handleEditReview(review)}>수정</button>
                    <button onClick={() => handleDeleteReview(review.id)}>삭제</button>
                  </div>
                )}
          </div>
        </div>
      ));
    };

    // 수정 모드로 전환
    const handleEditReview = (review) => {
      setIsEditing(true);
      setEditReviewText(review.movie_review_content); // 기존 리뷰 내용을 가져옴
    };

    // 리뷰 수정 요청 전송
    const handleUpdateReview = async (reviewId) => {
      try {
        const response = await axios.put(`/api/reviews/${reviewId}`, {
          movie_review_content: editReviewText,
          rate: rating,
        }, {
          headers: { userid }, // 로그인된 사용자의 userid를 헤더에 포함
        });

        // 리뷰 업데이트 후 다시 리스트를 새로고침
        setReviews(reviews.map(review => review.id === reviewId ? { ...review, movie_review_content: editReviewText } : review));
        setIsEditing(false); // 수정 모드 종료
      } catch (error) {
        console.error('Error updating review:', error);
      }
    };

    // 리뷰 삭제 요청 전송
    const handleDeleteReview = async (reviewId) => {
      try {
        await axios.delete(`/api/reviews/${reviewId}`, {
          headers: { userid }, // 로그인된 사용자의 userid를 헤더에 포함
        });

        // 리뷰 삭제 후 리스트 업데이트
        setReviews(reviews.filter(review => review.id !== reviewId));
      } catch (error) {
        console.error('Error deleting review:', error);
      }
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
                  title="공유하기"
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
                ref={reviewInputRef}
                onFocus={() => setIsPlaceholderVisible(false)}
                onBlur={() => {
                  if (reviewInputRef.current.textContent.trim() === '') {
                    setIsPlaceholderVisible(true);
                  }
                }}
                style={{ minHeight: '100px', width: '100%', border: '1px solid #ccc', padding: '10px' }}
              >
                {isPlaceholderVisible ? '한줄평을 남겨보세요' : ''}
              </div>
            </div>
            <button className="submit-btn" onClick={handleReviewSubmit}>
              리뷰 등록
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