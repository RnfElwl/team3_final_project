import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import image1 from '../img/05.jpeg';
import image2 from '../img/F04.jpeg';
import image3 from '../img/j01.png';

// banner
const images = [image1, image2, image3];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // 다음 이미지로 이동
    }, 3000); // 3초 후에 다음 이미지로 이동

    return () => clearTimeout(timeout); // 클린업 함수
  }, [currentIndex]); // currentIndex가 변경될 때마다 효과 발생

  return (
    <div className='home'>
      <div className="container">
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
                  opacity: index === currentIndex ? 1 : 0, // 현재 인덱스가 아닌 경우는 투명하게
                  position: 'absolute', // 이미지를 겹쳐 놓기 위해 절대 위치 사용
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
        <MovieList /> {/* MovieList 컴포넌트 추가 */}
      </div>
    </div>
  );
}

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const moviesPerPage = 6; // 한 페이지에 보여줄 영화 수
  const [isHovered, setIsHovered] = useState(false); // 호버 상태 추가

  useEffect (() => {
    // 데이터베이스에서 영화 데이터를 가져오는 함수 (예시로 하드코딩)
    const fetchMovies = async () => {
      // 실제 API 호출 예시
      // const response = await axios.get('/api/movies');
      // setMovies(response.data);

      // 예시 하드코딩 데이터
      const sampleMovies = [
        { id: 1, title: '영화 1', image: 'https://via.placeholder.com/150' },
        { id: 2, title: '영화 2', image: 'https://via.placeholder.com/150' },
        { id: 3, title: '영화 3', image: 'https://via.placeholder.com/150' },
        { id: 4, title: '영화 1', image: 'https://via.placeholder.com/150' },
        { id: 5, title: '영화 2', image: 'https://via.placeholder.com/150' },
        { id: 6, title: '영화 3', image: 'https://via.placeholder.com/150' },
        { id: 7, title: '영화 1', image: 'https://via.placeholder.com/150' },
        { id: 8, title: '영화 2', image: 'https://via.placeholder.com/150' },
        { id: 9, title: '영화 3', image: 'https://via.placeholder.com/150' },
        { id: 10, title: '영화 1', image: 'https://via.placeholder.com/150' },
        { id: 11, title: '영화 3', image: 'https://via.placeholder.com/150' },
        { id: 12, title: '영화 1', image: 'https://via.placeholder.com/150' }
      ];
      setMovies(sampleMovies);
    };

    fetchMovies();
  }, []);
  
  // 영화 리스트의 현재 인덱스를 기준으로 보여줄 영화 리스트를 계산
  const currentMovies = movies.slice(currentMovieIndex, currentMovieIndex + moviesPerPage);

  const handleNext = () => {
    if (currentMovieIndex + moviesPerPage < movies.length) {
      setCurrentMovieIndex(currentMovieIndex + moviesPerPage);
    }
  };

  const handlePrev = () => {
    if (currentMovieIndex > 0) {
      setCurrentMovieIndex(currentMovieIndex - moviesPerPage);
    }
  };

  return (
    <div className="movie-list"> 
      <h3>인기 Top10</h3>
      <div className="movie-grid" style={{position: 'relative', display: 'flex', overflowX: 'hidden' }}
        onMouseEnter={() => setIsHovered(true)} // 호버 상태 변경
        onMouseLeave={() => setIsHovered(false)}> 
        <div className="movie-slider" style={{ display: 'flex', transform: `translateX(-${(currentMovieIndex / moviesPerPage) * 100}%)`, transition: 'transform 0.5s ease' }}>
          {movies.map(movie => (
            <div key={movie.id} className="movie-item" style={{ flex: '0 0 16.66%', margin: '0 5px' }}>
              <img src={movie.image} alt={movie.title} />
            </div>
          ))}
        </div>
          {/* 버튼을 슬라이드 안에 배치 */}
        <button onClick={handlePrev} disabled={currentMovieIndex === 0} style={{ 
            position: 'absolute', 
            left: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: isHovered ? 'block' : 'none', // 호버 시에만 보이도록
            border: 'none',
            backgroundColor: 'transparent', // 배경을 투명하게
            color: 'white', // 버튼 텍스트 색상 설정
            fontSize: '30px', // 글자 크기 조정
            zIndex: 1 // 버튼을 가장 위로 표시
          }}>＜</button>
        <button onClick={handleNext} disabled={currentMovieIndex + moviesPerPage >= movies.length} style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: isHovered ? 'block' : 'none', // 호버 시에만 보이도록
            border: 'none',
            backgroundColor: 'transparent', // 배경을 투명하게
            color: 'white', // 버튼 텍스트 색상 설정
            fontSize: '30px', // 글자 크기 조정
            zIndex: 1 // 버튼을 가장 위로 표시
          }}>＞</button>
        
      </div>
    </div>
  );
}

export default Home;


