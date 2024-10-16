import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axios from '../component/api/axiosApi';
import '@fortawesome/fontawesome-free/css/all.css';
import { useNavigate } from 'react-router-dom';
import image1 from '../img/05.jpeg';
import image2 from '../img/F04.jpeg';
import image3 from '../img/j01.png';

// banner
const images = [image1, image2, image3];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return (
    <div className='home'>
        <div className="banner">
          <div className="banner-images" style={{ display: 'flex', overflow: 'hidden' }}>
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Slide ${index}`}
                className="banner-image"
                style={{
                  minWidth: '100%',
                  transition: 'opacity 1s ease-in-out',
                  opacity: index === currentIndex ? 1 : 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            ))}
          </div>
          <div className="banner-indicators">
            {images.map((_, index) => (
              <span key={index} className={index === currentIndex ? 'active' : ''}>
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
  const [currentMovieIndexes, setCurrentMovieIndexes] = useState(Array(5).fill(0)); // 각 리스트에 대한 인덱스 배열
  const moviesPerPage = 6; 
  const [hoveredListIndex, setHoveredListIndex] = useState(null); // 어떤 리스트에 마우스가 올라왔는지 저장
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook을 함수 컴포넌트 내부에서 호출

  // 카테고리 목록
  const category = [
    '인기 TOP20', 
    '기대작 TOP20', 
    '리뷰가 많은 컨텐츠', 
    '별점이 높은 컨텐츠', 
    '새로 올라온 컨텐츠'
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
    <div className="movie-list"> 
      <div className='container'>
        {loading ? ( // 로딩 상태에 따라 다른 UI 표시
          <div className="loading">Loading...</div> // 로딩 UI
        ) : (
          category.map((category, index) => ( 
            <div key={`category-${index}`}>
              <h3>{category}</h3>
              <div className="movie-grid"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}> 
                <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[index] / moviesPerPage) * 1200}px)` }}>
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
