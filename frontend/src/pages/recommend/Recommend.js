import "../../css/recommend/Recommend.css";
import React, { useState, useEffect } from 'react';
import axios from '../../component/api/axiosApi';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';

function Recommend() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userid, setUserid] = useState();
    const minSelection = 10; // 최소 선택 가능한 개수
    const [selectedStars, setSelectedStars] = useState({}); // 선택된 별점 상태
    const [hoveredStars, setHoveredStars] = useState({});   // 호버 중인 별점 상태
    const navigate = useNavigate(); // useNavigate 훅 사용
    

    // 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/recommend/list`);
                console.log(response.data);
                setMovies(response.data); // 영화 데이터를 가져옴
                setLoading(false); // 로딩 완료
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // 에러 발생 시에도 로딩 종료
            }
        };
        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                setUserid(response.data);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
        fetchData(); // 컴포넌트가 마운트될 때 데이터 가져옴
    }, []);

    // 별 클릭 핸들러
    const handleStarClick = (movieId, starIndex) => {
        const selectedStarCount = starIndex + 1; // 선택한 별점 수

        setSelectedStars(prevSelectedStars => {
            const updatedStars = { ...prevSelectedStars, [movieId]: selectedStarCount };
            console.log(`Movie ${movieId} selected ${selectedStarCount} stars.`);
            return updatedStars;
        });
    };

     // 마우스 호버 핸들러
     const handleStarHover = (movieId, starIndex) => {
        setHoveredStars(prevHoveredStars => {
            const updatedHoveredStars = { ...prevHoveredStars, [movieId]: starIndex + 1 };
            return updatedHoveredStars;
        });
    };

    // 마우스가 별점에서 벗어났을 때
    const handleStarMouseOut = (movieId) => {
        setHoveredStars(prevHoveredStars => {
            const updatedHoveredStars = { ...prevHoveredStars, [movieId]: 0 }; // 호버 해제 시 0으로 리셋
            return updatedHoveredStars;
        });
    };

    // 선택된 별점 개수 계산
    const selectedCount = Object.keys(selectedStars).length;

    // 다음 버튼 클릭 핸들러
    const handleNextClick = async () => {
        // 서버로 POST 요청 보내기
        const ratings = Object.entries(selectedStars).map(([movieId, starCount]) => ({
            movieId,
            starCount,
        }));

        try {
            for (const { movieId, starCount } of ratings) {
                // 별점 갯수만큼 서버로 데이터 전송
                for (let i = 0; i < starCount; i++) {
                    await axios.post(`http://localhost:9988/recommend/rate`, {
                        movie_genre: movies.find(movie => movie.movie_code === movieId).movie_genre,
                        count: 1, // 각 별점마다 count 1로 전송
                    });
                }
            }

            console.log('Sent ratings to the server:', ratings);
            const {data} = await axios.get("http://localhost:9988/getUserData", {params:{userid}});
            console.log(data);
            if(data.user_prefercheck==0){
                await axios.post("http://localhost:9988/event/prefer/check");
                await axios.post("http://localhost:9988/event/point/add", {event_point: 15});
            }
            navigate('/'); // 처리 후 홈으로 이동
        } catch (error) {
            console.error('Error sending ratings:', error);
        }
    };

    return (
        <div className="recommend">
            <div className="container">
                <div className="recommend_header">
                    <p className="choice">선택된 조건: {selectedCount}/{minSelection}</p>
                    {/* 다음 버튼 */}
                    <button 
                        className={`next-button ${selectedCount >= minSelection ? 'enabled' : ''}`} 
                        onClick={selectedCount >= minSelection ? handleNextClick : undefined}
                        disabled={selectedCount < minSelection} // 조건에 따라 버튼 비활성화
                    >
                        다음
                    </button>
                </div>
                <div className="recommend_list">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        movies.map(movie => (
                            <div key={movie.movie_code} className="recommend_item">
                                <img className="poster" src={movie.movie_link} alt={movie.movie_kor} />
                                <div className="movie_info">
                                    <p className="movie_title">{movie.movie_kor}</p>
                                    <div className="movie_datail">
                                        <p className="movie_genre">{movie.movie_genre} · </p>
                                        <p className="movie_state">{movie.movie_nation} · </p>
                                        <p className="product_year">{movie.opened_year}</p>
                                    </div>
                                </div>
                                <div className="rate">
                                    {[...Array(5)].map((_, index) => (
                                        <i 
                                        key={index} 
                                        className={`fa fa-star star-icon ${hoveredStars[movie.movie_code] > index || selectedStars[movie.movie_code] > index ? 'selected' : ''}`}
                                        onClick={() => handleStarClick(movie.movie_code, index)} 
                                        onMouseEnter={() => handleStarHover(movie.movie_code, index)} 
                                        onMouseLeave={() => handleStarMouseOut(movie.movie_code)}
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
