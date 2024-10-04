import "../../css/recommend/Recommend.css";
import React, { useState, useEffect } from 'react';
import axios from '../../component/api/axiosApi';
import { useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';

function Recommend(){
    const { genre, year, nation } = useParams(); // URL 파라미터에서 genre, year, nation의 id 가져옴
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const maxSelection = 10; // 최대 선택 가능한 개수

     // 선택된 조건 개수 계산
     const selectedCount = [genre, year, nation].filter(Boolean).length;

    useEffect(() => {
        const fetchMovies = async () => {
          setLoading(true);
          try {
            let url = `http://localhost:9988/api/movies`;
                
                // 선택한 조건에 따라 URL 파라미터 추가
                if (genre) {
                    url += `/genre/${genre}&`; // 장르별 영화 데이터
                }
                if (year) {
                    url += `/year/${year}&`; // 연도별 영화 데이터
                }
                if (nation) {
                    url += `/nation/${nation}&`; // 국가별 영화 데이터
                }
                
                // 최종 URL이 올바른지 확인 (콘솔 출력)
                console.log("Request URL:", url);

                const response = await axios.get(url); // axios로 GET 요청
                console.log('Fetched movies:', response.data); // 데이터를 콘솔에 출력
                setMovies(response.data); // 영화 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [genre, year, nation]);

    const handleStarClick = (movieId) => {
        console.log(`Movie ${movieId} star clicked!`);
    };

    return (
        <div className="recommend">
            <div className="container">
                <div className="recommend_header">
                    <p className="choice">선택된 조건: {selectedCount}/{maxSelection}</p>
                </div>
                <div className="recommend_list">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        movies.map(movie => (
                            <div key={movie.movie_code} className="recommend_item">
                                <img className="poster" src={movie.movie_link} alt={movie.title} />
                                <div className="movie_info">
                                    <p className="movie_title">{movie.movie_kor}</p>
                                    <p className="product_year">{movie.year}</p>
                                    <p className="movie_genre">{movie.genre}</p>
                                    <p className="movie_state">{movie.state}</p>
                                </div>
                                <div className="rate">
                                    {[...Array(5)].map((_, index) => (
                                        <i 
                                            key={index} 
                                            className="fa fa-star star-icon"
                                            onClick={() => handleStarClick(movie.id)} 
                                        />  
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Recommend;