import React, { useEffect, useState, useRef } from 'react';
import {useParams, useLocation, Link } from 'react-router-dom';
import { FaStar, FaRegBookmark, FaShareAlt } from 'react-icons/fa'; 
import './../../css/movies/MovieView.css';
import axios from '../../component/api/axiosApi';
import ReportModal from '../../component/api/ReportModal';
import { AiOutlineAlert } from "react-icons/ai";

function MovieView() {
  const { movieCode } = useParams(); // URL 파라미터에서 movie_code 가져옴
  const location = useLocation(); // 현재 경로 가져오기 위해 사용

  // 상태관리
  const [reviews, setReviews] = useState([]);
  const [movie, setMovie] = useState(null); // 영화 데이터를 저장할 상태
  const [images, setImages] = useState([]);  // 이미지 목록 상태
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userid, setUserId] = useState(null);
  const [userData, setUserData] = useState({});
  const [editReviewText, setEditReviewText] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [ratingInfo, setRatingInfo] = useState({ avg_rating: 0, review_count: 0 });
  const [inputText, setInputText] = useState(''); // 입력 필드
  const reviewInputRef = useRef(null); // 리뷰 입력 참조



  const [loading, setLoading] = useState(true); // 로딩 상태
  let once = 0;
  const [movieNo, setMovieNo] = useState(null); // 영화 번호 상태
  const [movieCodeState, setMovieCode] = useState(null); // 영화 코드 상태
  const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
  const [report, setReport] = useState({});//신고 폼에 있는 값들어있음

  
  // 1. 영화 정보 가져오기
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}`);
        console.log("1. 영화정보 가져오기 성공"); // API 응답 확인
        setMovie(response.data.movieVO); // 영화 데이터 상태에 저장
        setUserId(response.data.userid); // 유저 ID 상태에 저장
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };
    fetchMovieData();
  }, [movieCode]);

  // 2. 유저 데이터 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await axios.get('http://localhost:9988/getUserData', { params: { userid } });
        console.log("2. 유저데이터 가져오기 성공")
        setUserData(result.data); // 유저 데이터 상태에 저장
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userid) fetchUserData(); // 유저 ID가 있을 때만 호출
  }, [userid]);

  // 3. 이미지 정보 가져오기
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}/images`);
        console.log("3. 이미지 가져오기 성공")
        setImages(response.data); // 이미지 데이터 상태에 저장
      } catch (error) {
        console.error("이미지 가져오기 실패: ", error);
      }
    };
    fetchImages();
  }, [movieCode]);

  // 4. 리뷰 정보 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:9988/api/reviews/${movieCode}`);
        console.log("4. 리뷰 정보 가져오기 성공"); // 리뷰 데이터 확인
        setReviews(response.data); // 리뷰 상태에 저장
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [movieCode]);

  // 5. 평균 평점과 리뷰 개수 가져오기
  useEffect(() => {
    const fetchRatingInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}/rating`);
        console.log("5. 평점정보 가져오기 성공"); // 평점 정보 확인
        setRatingInfo(response.data); // 평점 상태에 저장
      } catch (error) {
        console.error("Error fetching rating info:", error);
      }
    };
    fetchRatingInfo();
  }, [movieCode]);

  // 로딩 상태 관리
  useEffect(() => {
    const isLoading = !movie || !images || !reviews || !ratingInfo;
    setLoading(isLoading); // 필요한 데이터가 모두 로드될 때까지 로딩
  }, [movie, images, reviews, ratingInfo]);
  useEffect(()=>{
    if(once==0){
      once = 1;
      console.log("한번만 실행!!!!!!!!!!!!!!!");
      historySetting();
    }
  }, []);


  // 선호 정보 저장
  useEffect(() => {
    const saveUserPreference = async () => {
      try {
        const { data: movieGenre } = await axios.get(`http://localhost:9988/api/prefer/genre/${movieCode}`);
        console.log("영화장르 가져오기 성공");
        const response = await axios.post('http://localhost:9988/api/prefer/save', {
          userid,
          movie_genre: movieGenre          
        });
        console.log("6. 선호장르 저장하기 성공");

      } catch (error) {
        console.error('Error saving user preference:', error);
      }
    };
    if (userid) saveUserPreference();

  }, [movieCode, userid]);




  // userid가 설정된 후에 북마크 상태를 가져오도록 useEffect 분리
  useEffect(() => {
    console.log("useEffect 실행됨 - userid와 movieCode 상태 확인:", { userid, movieCode });
    if (userid && movieCode) {
      const fetchBookmarkStatus = async () => {
        try {
          console.log("북마크 상태 확인 API 호출 시작");

    const response = await axios.post('http://localhost:9988/api/bookmarks/check', {
      movieCode,
      userid  // movieCode를 전송
    });
  
    setIsFavorite(response.data); // 응답 상태 설정
    console.log("7. 북마크 불러오기 성공:", response.data);
        } catch (error) {
          console.error("북마크 정보 가져오기 실패:", error);
        }
      };
      fetchBookmarkStatus();
    }
  }, [userid, movieCode]);



  function openReport(id, userid, content){{/* 신고 기능 */}
        setReport({
            report_tblname: 1,
            report_tblno:  id,
            reported_userid: userid,
            report_content: content,// 피신고자의 채팅 내용
        });        
      toggleReport();
      resetReview();
  }

  function toggleReport(){{/* 신고 기능 */}
  setReportShow(!reportShow);
  }


  // 조회수
  async function historySetting(){
      try{
        const response = await axios.get(`http://localhost:9988/api/movies/${movieCode}`);
        const editData = response.data.movieVO;
        console.log(editData.movie_no);
        const {data} = await axios.post("http://localhost:9988/api/movies/hit", editData);
        console.log("editData=" + editData);
        if(data===1){
          console.log("조회수 올리기 성공");
        }
        else{
          throw new Error("조회수, 최근본 영화, 취향 업데이트중 오류");
        }
      }catch(e){
        console.log(e);
      }

  }
  // 북마크 토글 함수
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
        console.log("북마크 추가 성공");
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
  };

  //////////////////// 리뷰 관련 //////////////////////////

  // 리뷰 제출 함수
  const handleReviewSubmit = async () => {
    try{
      // 유저가 이미 리뷰를 작성했는지 확인
      const existResponse = await axios.get(`http://localhost:9988/api/reviews/check`, {
        params: {
          movieNo: movie.movie_no,
          userid: userid
        },
    });

    const reviewExists = existResponse.data;


    if (reviewExists) {
      alert('하나의 영화에 대한 리뷰 작성은 한 번만 가능합니다');
      return;
    }

    // 리뷰 텍스트가 비어있는지 확인
    if (!inputText.trim()) {
      alert('리뷰 내용을 입력해주세요!');
      return;
    }

    // 별점이 0점인지 확인
    if (rating === 0) {
      alert('별점을 선택해주세요!');
      return;
    }

    // 리뷰 서버로 전송
    const response = await axios.post('http://localhost:9988/api/reviews/add', {
      userid,
      movie_no: movie.movie_no,
      movie_review_content: inputText.trim(),
      rate: rating,
    });
    console.log('리뷰 등록 성공:', response.data);

    // 새로운 리뷰 가져와서 상태 업데이트
    await resetReview();

    // 리뷰 입력 초기화
    setInputText(''); // 입력 텍스트 초기화
  } catch (error) {
    console.error('Error submitting review:', error);
  }
    };
  

  // 리뷰 목록 새로고침 함수
  async function resetReview(){
    try{
      const reviewResponse = await axios.get(`http://localhost:9988/api/reviews/${movieCode}`);
        console.log("내가 쓴 리뷰 불러오기 성공"); // 리뷰 데이터 로그로 확인
        setReviews(reviewResponse.data); // 서버에서 가져온 리뷰 저장
    }catch(error){
      console.error('Error fetching reviews:', error);
    }
  };

    // 리뷰 수정 요청 전송 함수
    const handleUpdateReview = async (movie_review_no) => {
      if (!movie_review_no) {
        console.error('Error: 수정할 movie_code 불러오지 못함');
        return;
      }
      try {
        const response = await axios.put(`http://localhost:9988/api/reviews/${movie_review_no}`, {
          movie_review_no,
          movie_review_content: editReviewText.trim(), // 리뷰 내용
          rate: rating,                        // 별점
        });

        console.log('리뷰 수정 성공', response.data);

         // 수정 후 리뷰 목록 새로고침
          await resetReview(); 
          setEditingReviewId(null); // 수정 모드 종료

      } catch (error) {
        console.error('Error updating review:', error);
        console.error('Response:', error.response?.data || 'No response data');
      }
    };

      // 수정 모드로 전환
      const handleEditReview = (review) => {
        setEditingReviewId(review.movie_review_no); // 수정 중인 리뷰의 ID를 설정
        setEditReviewText(review.movie_review_content); // 기존 리뷰 내용을 가져옴
        setRating(review.rate); // 기존 별점 로드
      

      // 리뷰의 영화 정보 설정
      // setMovieNo(review.movie_no);  // 영화 번호 설정
      setMovieCode(review.movie_code);  // 영화 코드 설정
      };

    
    
      // 리뷰 삭제 요청 전송
      const handleDeleteReview = async (movie_review_no) => {
        try {
          await axios.delete(`http://localhost:9988/api/reviews/${movie_review_no}`);
          console.log('리뷰 삭제 성공');

          // 리뷰 목록 새로고침
          setReviews(reviews.filter(review => review.movie_review_no !== movie_review_no));
        } catch (error) {
          console.error('Error deleting review:', error);
        }
      };

    ///////////////////////////////////////////////////////////////////// 리뷰 컴포넌트
    const renderReviews = () => {
      return reviews.map((review) => (
        <div key={review.movie_review_no} className="review">
          <div className="profile-section">
            {review.userid === userid? 
            <Link to={`/mypage`}>
              <img src={`http://localhost:9988/${review.userprofile}`} alt="User profile" className="profile-img" />
            </Link>:
            <Link to={`/user/info/${review.usernick}`}>
              <img src={`http://localhost:9988/${review.userprofile}`} alt="User profile" className="profile-img" />
            </Link>}
          
          <span className="nickname">{review.usernick}</span>
          </div>

          <div className="review-content">
            {editingReviewId !== review.movie_review_no && (
            <div className="star-rating">
              {[...Array(5)].map((star, index) => (
                <FaStar
                  key={index}
                  className={`star ${
                    index <
                  ((editingReviewId === review.movie_review_no || inputText) 
                    ? (hoverRating || rating) 
                    : review.rate)
                    ? 'active' 
                    : ''
                }`}
                onMouseEnter={() => {
                  if (editingReviewId === review.movie_review_no || inputText) {
                    setHoverRating(index + 1); // 작성 또는 수정 중일 때만 hover 허용
                  }
                }}
                onMouseLeave={() => {
                  if (editingReviewId === review.movie_review_no || inputText) {
                    setHoverRating(0); // 작성 또는 수정 중일 때만 초기화
                  }
                }}
                onClick={() => {
                  if (editingReviewId === review.movie_review_no || inputText) {
                    setRating(index + 1); // 작성 또는 수정 중일 때만 별점 선택 가능
                  }
                }}
                style={{
                  cursor:
                    editingReviewId === review.movie_review_no || inputText
                      ? 'pointer'
                      : 'default',
                }}
                />
              ))}
            </div>
            )}
            {userid==review.userid?"":<AiOutlineAlert size="25px" onClick={()=>{openReport(review.movie_review_no, review.userid, review.movie_review_content)}} />}
            

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
              <textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)} // 상태 업데이트
                className="review-edit-input"          
              />
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
    const formattedCasts = movie?.movie_casts ? movie.movie_casts.replace(/\//g, ', ') : '출연진 정보 없음';
    
    return (
        <div className="movie-view-container">
          <ReportModal    
                reportShow={reportShow}// 모달창 보이기 여부
                toggleReport={toggleReport} // 모달창 열고닫기 함수
                report={report}// 신고 데이터 변수
                setReport={setReport} // 신고 데이터 변수 세팅
                setDefaultList={resetReview}
            />

          <div className="movie-content">
            <div className="contents-box">
              <div className="movie-image">
              {movie?.movie_link ? (
                <img src={movie.movie_link} alt={movie.movie_kor} />
              ) : (
                <p>이미지 없음</p>
              )}
            </div>

              {/* 영화 제목과 버튼들 */}
              <div className="movie-details">
                <div className="movie-title">
                    <h1>{movie?.movie_kor || '영화 제목 없음'}</h1>
                </div>

                <div className="movie-info">
                    <div className="rating-info">
                        <FaStar className="star-icon"/>
                        {ratingInfo.avg_rating?.toFixed(1) || 0} ({ratingInfo.review_count || 0}) {/* 평균 평점과 평점 개수 */}
                    </div>
                    <div className="info-details">
                    <span>{movie?.movie_genre || '장르 없음'}</span>
                    <span>| {movie?.opened_year || '개봉 연도 미상'}년</span>
                    <span>| {movie?.movie_showtime || '시간 미상'}분</span>
                    <span>| {movie?.movie_grade || '등급 미정'}</span>
                    </div>
                    {/* 시놉시스 */}
                    <div className="info-synops">
                      {movie?.movie_synops || '줄거리 정보 없음'}
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
                <p>{movie?.movie_directors || '감독 정보 없음'}</p>
              </div>
            </div>
        </div>

        {/* 이미지 표시 섹션 */}
        {images.length > 0 && (
          <div className="image-gallery">
            <h3>관련 이미지</h3>
            <div className="image-row">
              {images.slice(0, 3).map((img, index) => (
                <img key={index} src={img} alt={`관련 이미지 ${index + 1}`} className="gallery-image" />
              ))}
            </div>
          </div>
        )}

        {/* 사용자 평 섹션 */}
        <div className="review-section">
          <div className="review-header">
            <h2><b>'{movie?.movie_kor || '영화 제목 없음'}'</b>의 사용자 평</h2>
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
              <textarea
                ref={reviewInputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)} // 입력 내용이 변경될 때 상태 업데이트
                placeholder="한줄평을 남겨보세요"
                className="review-input"
              />
              
              </div>
              <button className="submit-btn" onClick={handleReviewSubmit}>
              리뷰 등록
            </button>
            </div>
            
          </div>
          {/* 리뷰 리스트 */}
          <div className="review-section">
            {renderReviews()}
          </div>
        </div>
      </div>  
    
    );
}

export default MovieView;