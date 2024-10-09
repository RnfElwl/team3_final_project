import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axios from '../component/api/axiosApi';
import '@fortawesome/fontawesome-free/css/all.css';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [currentMovieIndexes, setCurrentMovieIndexes] = useState(Array(8).fill(0)); // 각 리스트에 대한 인덱스 배열
  const moviesPerPage = 6; 
  const [hoveredListIndex, setHoveredListIndex] = useState(null); // 어떤 리스트에 마우스가 올라왔는지 저장
  //const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook을 함수 컴포넌트 내부에서 호출

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:9988/recommend/list`);
        console.log(response.data);
        setMovies(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
    if (currentMovieIndexes[index] + moviesPerPage < movies.length) {
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
      {['인기 TOP20', '기대작 TOP20', '리뷰가 많은 컨텐츠', '별점이 높은 컨텐츠', '새로 올라온 컨텐츠', '나이', '장르', '성별'].map((category, index) => (
          <div key={index}>
            <h3>{category}</h3>
            <div className="movie-grid"
              onMouseEnter={() => handleMouseEnter(index)} 
              onMouseLeave={handleMouseLeave}> 
              <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[index] / moviesPerPage) * 1200}px)` }}>
              {/* <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[index] / moviesPerPage) * 41}%)` }}> */}
                {movies.map(movie => (
                  <div key={movie.movie_code} className="movie-item">
                    <img src={movie.movie_link} alt={movie.title} onClick={() => handleCardClick(movie.movie_code)}/>
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
                disabled={currentMovieIndexes[index] + moviesPerPage >= movies.length} 
                className='buttonNext' 
                style={{ display: hoveredListIndex === index ? 'block' : 'none' }}>＞</button>
            </div>
          </div>
        ))}
        
        {/* <h3>인기 TOP20</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[0] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(0)} disabled={currentMovieIndexes[0] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(0)} disabled={currentMovieIndexes[0] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>기대작 TOP20</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[1] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(1)} disabled={currentMovieIndexes[1] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(1)} disabled={currentMovieIndexes[1] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>리뷰가 많은 컨텐츠</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[2] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(2)} disabled={currentMovieIndexes[2] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(2)} disabled={currentMovieIndexes[2] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>별점이 높은 컨텐츠</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[3] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(3)} disabled={currentMovieIndexes[3] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(3)} disabled={currentMovieIndexes[3] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>새로 올라온 컨텐츠</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[4] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(4)} disabled={currentMovieIndexes[4] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(4)} disabled={currentMovieIndexes[4] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>나이</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[5] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(5)} disabled={currentMovieIndexes[5] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(5)} disabled={currentMovieIndexes[5] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>장르</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[6] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(6)} disabled={currentMovieIndexes[6] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(6)} disabled={currentMovieIndexes[6] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div>

        <h3>성별</h3>
        <div className="movie-grid"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}> 
          <div className="movie-slider" style={{ transform: `translateX(-${(currentMovieIndexes[7] / moviesPerPage) * 100}%)` }}>
            {movies.map(movie => (
              <div key={movie.movie_code} className="movie-item">
                <img src={movie.movie_link} alt={movie.title}/>
              </div>
            ))}
          </div>
          <button onClick={() => handlePrev(7)} disabled={currentMovieIndexes[7] === 0} className='buttonPrev' style={{ display: isHovered ? 'block' : 'none' }}>＜</button>
          <button onClick={() => handleNext(7)} disabled={currentMovieIndexes[7] + moviesPerPage >= movies.length} className='buttonNext' style={{ display: isHovered ? 'block' : 'none' }}>＞</button>
        </div> */}

      </div>
    </div>
  );
}

export default Home;


