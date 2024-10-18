import React, { useEffect, useState, useRef } from 'react';
import {useParams, useLocation, Link } from 'react-router-dom';
import { FaStar, FaRegBookmark, FaShareAlt } from 'react-icons/fa'; 
import './../../css/movies/MovieView.css';
import axios from '../../component/api/axiosApi';

function MovieView() {
  
  const [reviews, setReviews] = useState([]);
  const { movieCode } = useParams(); // URL 파라미터에서 movie_code 가져옴
  const [movie, setMovie] = useState(null); // 영화 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [images, setImages] = useState([]);  // 이미지 목록 상태
  const [rating, setRating] = useState(0); // 별점 상태
  const [hoverRating, setHoverRating] = useState(0); // 마우스 호버 상태 추가
  const [isFavorite, setIsFavorite] = useState(false); // 찜하기 상태 추가
  const location = useLocation(); // 현재 경로 가져오기 위해 사용
  const [userid, setUserId] = useState(null); // userid를 상태로 관리
  const [userData, setUserData] = useState({});
  const [editReviewText, setEditReviewText] = useState(''); // 수정할 리뷰 내용 저장
  const [editingReviewId, setEditingReviewId] = useState(null); // 수정 중인 리뷰의 ID를 저장
  const [movieNo, setMovieNo] = useState(null); // 영화 번호 상태
  const [movieCodeState, setMovieCode] = useState(null); // 영화 코드 상태
  const [ratingInfo, setRatingInfo] = useState({ avg_rating: 0, review_count: 0 }); // 평점 정보 상태

  
  // Ref로 contentEditable 요소를 제어
  const reviewInputRef = useRef(null);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true); // 상태 추가

  // 처음 시작할때 불러올 값들
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true); // 로딩 상태 시작
      try {
        // 영화 정보 가져오기
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}`);
        console.log(response.data); // API 응답 데이터 콘솔에 출력
        setMovie(response.data.movieVO); // 영화 데이터를 상태에 저장
        setUserId(response.data.userid);
        const userid = response.data.userid;
        const result2 = await axios.get('http://localhost:9988/getUserData', { params:{userid }});
        
        setUserData(result2.data);
        // 이미지 정보 가져오기
        const imageResponse = await axios.get(`http://localhost:9988/api/movies/${movieCode}/images`);
        setImages(imageResponse.data);
        
      
        // 리뷰 정보 가져오기
        const reviewResponse = await axios.get(`http://localhost:9988/api/reviews/${movieCode}`);
        console.log('Fetched reviews:', reviewResponse.data); // 리뷰 데이터 로그로 확인
        setReviews(reviewResponse.data); // 서버에서 가져온 리뷰 저장

        // 평균 평점과 리뷰 개수 가져오기
        const ratingResponse = await axios.get(`http://localhost:9988/api/movies/${movieCode}/rating`);
        console.log('Rating info:', ratingResponse.data); // API 응답 데이터 확인
        setRatingInfo(ratingResponse.data); // 상태에 평점 정보 저장
        
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };
    fetchMovieData();
  }, [movieCode, userid]);

  // 선호 정보 저장
  useEffect(() => {
    const saveUserPreference = async () => {
      try {
        const { data: movieGenre } = await axios.get(
          `http://localhost:9988/api/prefer/genre/${movieCode}`
        );

        const response = await axios.post('http://localhost:9988/api/prefer/save', {
          userid,
          movie_genre: movieGenre          
        });

      } catch (error) {
        console.error('Error saving user preference:', error);
      }
    };
    if (userid) saveUserPreference();
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

  //////////////////// 리뷰 관련 //////////////////////////

  // 리뷰 제출 함수
  const handleReviewSubmit = async () => {
    
    // 유저가 이미 리뷰를 작성했는지 확인
    const existResponse = await axios.get(`http://localhost:9988/api/reviews/check`, {
      params: {
        movieNo: movie.movie_no,
        userid: userid
      }
    });

    const reviewExists = existResponse.data;

    if (reviewExists) {
      alert('하나의 영화에 대한 리뷰 작성은 한 번만 가능합니다');
      return; // 중단
    }

    const reviewText = reviewInputRef.current.textContent; // 입력된 텍스트 가져오기
    if (rating > 0 && reviewText) {
      try {
        if (!userid) {
          alert("리뷰를 작성하려면 로그인하세요!");
          return;
        }

        // 데이터 로그 추가
      console.log("데이터가 잘가나?", {
        userid,
        movie_no: movie.movie_no,
        movie_review_content: reviewText,
        rate: rating,
      });




        // 리뷰 서버로 전송
        const response = await axios.post('http://localhost:9988/api/reviews/add', {
          userid,
          movie_no: movie.movie_no,
          movie_review_content: reviewText,
          rate: rating,
        });
        // 새로운 리뷰 추가 후 상태 업데이트
        const reviewResponse = await axios.get(`http://localhost:9988/api/reviews/${movieCode}`);
        console.log('Fetched reviews:', reviewResponse.data); // 리뷰 데이터 로그로 확인
        setReviews(reviewResponse.data); // 서버에서 가져온 리뷰 저장
        // 리뷰 입력 초기화
        reviewInputRef.current.textContent = ''; // 리뷰 입력 초기화
        setIsPlaceholderVisible(true); // placeholder 다시 표시
        console.log(reviews);
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

    // 리뷰 수정 요청 전송
    const handleUpdateReview = async (movie_review_no) => {
      if (!movie_review_no) {
        console.error('Error: movie_review_no is undefined or null');
        return;
      }
      // 요청 데이터 확인
      console.log('Updating review with data:', {
        movie_review_content: editReviewText, // 리뷰 내용
        rate: rating,                        // 별점
        movie_review_no: movie_review_no      // 리뷰 번호 (고유 ID)
      });
      try {
        const response = await axios.put(`http://localhost:9988/api/reviews/${movie_review_no}`, {
          movie_review_no,
          movie_review_content: editReviewText, // 리뷰 내용
          rate: rating,                        // 별점
        });
        console.log('Review updated:', response.data);

        // 리뷰 업데이트 후 다시 리스트를 새로고침
        setReviews(reviews.map(review =>
          review.movie_review_no === movie_review_no 
          ? { ...review, movie_review_content: editReviewText, rate: rating}
          : review
          ));
          setEditingReviewId(null); // 수정 모드 종료

      } catch (error) {
        console.error('Error updating review:', error);
        console.error('Response:', error.response?.data);
      }
    };

      // 수정 모드로 전환
      const handleEditReview = (review) => {
        setEditingReviewId(review.movie_review_no); // 수정 중인 리뷰의 ID를 설정
        setEditReviewText(review.movie_review_content); // 기존 리뷰 내용을 가져옴
        setRating(review.rate); // 기존 별점 값을 초기화
        // 리뷰의 영화 정보 설정
        setMovieNo(review.movie_no);  // 영화 번호 설정
        setMovieCode(review.movie_code);  // 영화 코드 설정

      };
      
    
      // 리뷰 삭제 요청 전송
      const handleDeleteReview = async (movie_review_no) => {
        try {
          await axios.delete(`http://localhost:9988/api/reviews/${movie_review_no}`);
          
          // 리뷰 삭제 후 리스트 업데이트
          setReviews(reviews.filter(review => review.movie_review_no !== movie_review_no));
        } catch (error) {
          console.error('Error deleting review:', error);
        }
      };
  
    // 리뷰 컴포넌트
    const renderReviews = () => {
      return reviews.map((review) => (
        <div key={review.movie_review_no} className="review">
          <div className="profile-section">
            {review.userid==userid? 
            <Link to={`/mypage`}>
              <img src={`http://localhost:9988/${review.userprofile}`} alt="User profile" className="profile-img" />
            </Link>:
            <Link to={`/user/info/${review.usernick}`}>
              <img src={`http://localhost:9988/${review.userprofile}`} alt="User profile" className="profile-img" />
            </Link>}
          
          <span className="nickname">{review.usernick}</span>
          </div>
          <div className="review-content">
            {/* 항상 표시되는 별점*/}
            {editingReviewId !== review.movie_review_no && (
            <div className="star-rating">
              {[...Array(5)].map((star, index) => (
                <FaStar
                  key={index}
                  className={`star ${index < review.rate ? 'active' : ''}`} // review.rate 사용
                  
                />
              ))}
            </div>
            )}

            {editingReviewId === review.movie_review_no ? (
            <div className="edit-review-section">
              {/* 수정 가능한 별점 필드 - 수정 모드일때만 표시*/}
              <div className="star-rating">
                {[...Array(5)].map((star, index) => (
                  <FaStar
                    key={index}
                    className={`star ${index < (hoverRating || rating) ? 'active' : ''}`} // hover 및 rating 상태 반영
                    onMouseEnter={() => setHoverRating(index + 1)} // 마우스 오버 시
                    onMouseLeave={() => setHoverRating(0)}        // 마우스가 벗어나면 초기화
                    onClick={() => setRating(index + 1)}           // 클릭 시 별점 선택
                    style={{ cursor: 'pointer' }}
                  />
                ))}
                </div>

            {/* 수정 입력 필드 */}
            <div
              contentEditable
              className="review-edit-input"
              onInput={(e) => setEditReviewText(e.target.textContent)}
              style={{ minHeight: '100px', width: '100%', border: '1px solid #ccc', padding: '10px' }}

                              
            >
              {editReviewText}
            </div>
            {/* 저장, 취소 버튼 */}
            <div className="review-actions">
              <button onClick={() => handleUpdateReview(review.movie_review_no)} className="edit-btn">저장</button>
              <button onClick={() => setEditingReviewId(null)} className="delete-btn">취소</button>
            </div>
          </div>
          ) : (
            <p className="review-text">{review.movie_review_content}</p>
          )}
            {review.userid === userid && editingReviewId !== review.movie_review_no && (
            <div className="review-actions">
              <button onClick={() => handleEditReview(review)} className="edit-btn">수정</button>
              <button onClick={() => handleDeleteReview(review.movie_review_no)} className="delete-btn">삭제</button>
            </div>
            )}
          </div>
        </div>
      ));
    };

    // 배우를 /가 아닌 , 로 구분
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
                        <FaStar className="star-icon" />  {ratingInfo.avg_rating.toFixed(1)} ({ratingInfo.review_count}) {/* 평균 평점과 평점 개수 */}
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
              <img src={`http://localhost:9988/${userData.image_url}`} alt="Profile" className="profile-img" />
              <span className="nickname">{userData.usernick}</span>
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