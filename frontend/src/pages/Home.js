import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axios from '../component/api/axiosApi';
import '@fortawesome/fontawesome-free/css/all.css';
import { useNavigate, Link } from 'react-router-dom';
import image1 from '../img/banner1.png';
import image2 from '../img/banner2.png';
import image3 from '../img/banner3.png';
import image4 from '../img/banner4.png';
import image5 from '../img/banner5.png';
import image6 from '../img/banner6.png';
import image7 from '../img/banner7.png';
import image8 from '../img/banner8.png';
import image9 from '../img/banner9.png';
import image10 from '../img/banner10.png';
import {HomeSliderSettings} from "../component/api/SliderSetting";
import Slider from "react-slick";
// banner
const bannerData = [
  { movieCode: 20163137, image: image1, title: 'Movie 1' },
  { movieCode: 20163137, image: image2, title: 'Movie 2' },
  { movieCode: 20224667, image: image3, title: 'Movie 3' },
  { movieCode: 20224667, image: image4, title: 'Movie 4' },
  { movieCode: 20224667, image: image5, title: 'Movie 5' },
  { movieCode: 20203702, image: image6, title: 'Movie 6' },
  { movieCode: 20203702, image: image7, title: 'Movie 7' },
  { movieCode: 20249434, image: image8, title: 'Movie 8' },
  { movieCode: 20205144, image: image9, title: 'Movie 9' },
  { movieCode: 20205144, image: image10, title: 'Movie 10' },
];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  const handleBannerClick = (movieCode) => {
    const currentMovie = bannerData[currentIndex];
    navigate(`/movies/view/${currentMovie.movieCode}`); // 영화의 고유 ID로 페이지 이동
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className='home'>
        <div className="banner">
          <div className="banner-images" style={{ display: 'flex', overflow: 'hidden' }}>
            {bannerData.map((movie, index) => (
              <img
                key={index}
                src={movie.image}
                alt={movie.title}
                className="banner-image"
                onClick={handleBannerClick}
                style={{
                  minWidth: '100%',
                  transition: 'opacity 1s ease-in-out',
                  opacity: index === currentIndex ? 1 : 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
          <div className="banner-indicators">
            {bannerData.map((_, index) => (
              <span 
                key={index} 
                className={index === currentIndex ? 'active' : ''}
                onClick={() => handleIndicatorClick(index)}
                style={{
                  cursor: 'pointer', 
                  margin: '20px 7px',
                }}  
              >
                ●
              </span>
            ))}
          </div>
        </div>
        <MovieList />
    </div>
  );
}

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndexes, setCurrentMovieIndexes] = useState(Array(8).fill(0)); // 각 리스트에 대한 인덱스 배열
  const [moviesPerPage, setMoviesPerPage] = useState(8); // 초기값 8개
  const [hoveredListIndex, setHoveredListIndex] = useState(null); // 어떤 리스트에 마우스가 올라왔는지 저장
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook을 함수 컴포넌트 내부에서 호출

  // 카테고리 목록
  const category = [
    '인기 TOP20', 
    '기대작 TOP20', 
    '리뷰가 많은 컨텐츠', 
    '별점이 높은 컨텐츠', 
    '새로 올라온 컨텐츠',
    '추천 장르',
    '회원님의 나이를 고려한 컨텐츠',
    '회원님의 성별을 고려한 컨텐츠'
  ];

  // 각 카테고리에 대한 영화 데이터 로딩
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const allMovies = await Promise.all(category.map(async (cat) => {
          let response;
          switch (cat) {
            case '인기 TOP20':
              response = await axios.get(`http://localhost:9988/recommend/bookmark`);
              break;
            case '기대작 TOP20':
              response = await axios.get(`http://localhost:9988/recommend/hit`);
              break;
            case '리뷰가 많은 컨텐츠':
              response = await axios.get(`http://localhost:9988/recommend/review`);
              break;
            case '별점이 높은 컨텐츠':
              response = await axios.get(`http://localhost:9988/recommend/rating`);
              break;
            case '새로 올라온 컨텐츠':
              response = await axios.get(`http://localhost:9988/recommend/release`);
              break;
            default:
              response = { data: [] }; // 기본값
          }
          return response.data; // 응답 데이터 반환
        }));

        setMovies(allMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]); // 에러 시 빈 배열 반환
      } finally {
        setLoading(false); // 로딩 상태 업데이트
      }
    };

    loadMovies();
  }, []);

  const handlePrev = (index) => {
    if (currentMovieIndexes[index] > 0) {
      setCurrentMovieIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] -= moviesPerPage;
        return newIndexes;
      });
    }
  };

  const handleNext = (index) => {
    if (currentMovieIndexes[index] + moviesPerPage < movies[index]?.length) {
      setCurrentMovieIndexes((prevIndexes) => {
        const newIndexes = [...prevIndexes];
        newIndexes[index] += moviesPerPage;
        return newIndexes;
      });
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredListIndex(index); // 마우스가 올라오면 해당 리스트 인덱스 저장
  };

  const handleMouseLeave = () => {
    setHoveredListIndex(null); // 마우스가 나가면 null로 설정
  };

  // 영화 카드 클릭 시 상세 페이지로 이동하는 함수
  const handleCardClick = (movieCode) => {
    navigate(`/movies/view/${movieCode}`); // movieCode만 사용
  };

  return (
    <div className='movie-list'> 
        {loading ? ( // 로딩 상태에 따라 다른 UI 표시
          <div className="loading">Loading...</div> // 로딩 UI
        ) : (
          category.map((category, index) => ( 
            <>
            {movies[index].length==0? <></> :
              <div key={`category-${index}`} className='category_list'
                onMouseEnter={() => handleMouseEnter(index)} // 마우스 오버 시
                onMouseLeave={handleMouseLeave} // 마우스 나가면
              > 
              <h3>{category}</h3>
              {movies.length > 0 ? (
                <Slider {...HomeSliderSettings} >
                {movies[index].map((slide, index) => (
                   <Link to={`/movies/view/${slide.movie_code}`} key={index} className='movie-item'>
                   <img className="slidPoster" src={slide.movie_link} alt={slide.movie_kor || "empty"} />
                 </Link>
                                ))}
                                </Slider>
                                
                              ) 
                              
                              : 
                              (
                                // <div className="noslide">
                                //     <BsExclamationCircle />
                                //     <p>시청기록이 없습니다</p>
                                // </div>
                                <>
                                </>
                              )
                              
                            }
                            
                            
                            {/* <div className="movie-grid"
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={handleMouseLeave}> 
                              <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[index] / moviesPerPage) * 100}%)` }}>
                              {movies[index] && movies[index].slice(currentMovieIndexes[index], currentMovieIndexes[index] + moviesPerPage).map(movie => (
                                <div key={movie.movie_code || movie.id} className="movie-item">
                                <img src={movie.movie_link} alt={movie.title} onClick={() => handleCardClick(movie.movie_code)} />
                                </div>
                                ))}
                                </div>
                                <button 
                                onClick={() => handlePrev(index)} 
                                disabled={currentMovieIndexes[index] === 0} 
                                className='buttonPrev' 
                                style={{ display: hoveredListIndex === index ? 'block' : 'none' }}>＜</button>
                                <button 
                                onClick={() => handleNext(index)}
                                disabled={currentMovieIndexes[index] + moviesPerPage >= (movies[index]?.length || 0)} 
                                className='buttonNext' 
                                style={{ display: hoveredListIndex === index ? 'block' : 'none' }}>＞</button>
                                </div> */}
                                </div>
                              }
                              </>))
                            )}
    </div>
  );
}

export default Home;
