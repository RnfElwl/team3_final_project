import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './../../css/movies/MovieList.css';

function MovieList() {
  const { type, id } = useParams(); // URL 파라미터에서 카테고리 정보 가져옴
  const [movies, setMovies] = useState([]);
  const [categoryName, setCategoryName] = useState(''); // 선택된 카테고리 이름 저장
  const [otherCategories, setOtherCategories] = useState([]); // 다른 카테고리 저장

  useEffect(() => {
    // 더미 카테고리 데이터
    const categories = {
      genre: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Documentary'],
      year: ['2020', '2021', '2022', '2023', '2024'],
      country: ['USA', 'UK', 'France', 'Germany', 'Japan'],
    };

    // 현재 선택된 카테고리의 이름 설정
    const currentCategory = categories[type][id - 1];
    setCategoryName(currentCategory);

    // 선택된 카테고리 외의 다른 카테고리 리스트 설정
    const filteredCategories = categories[type].filter((_, index) => index + 1 !== parseInt(id));
    setOtherCategories(filteredCategories);

    // 영화 데이터를 더미로 설정 (API 호출로 대체 가능)
    const fetchMovies = async () => {
      const dummyMovies = [
        { id: 1, title: 'Movie 1', description: 'Description for movie 1' },
        { id: 2, title: 'Movie 2', description: 'Description for movie 2' },
        { id: 3, title: 'Movie 3', description: 'Description for movie 3' },
        { id: 4, title: 'Movie 4', description: 'Description for movie 4' },
        { id: 5, title: 'Movie 5', description: 'Description for movie 5' },
        { id: 6, title: 'Movie 6', description: 'Description for movie 6' },
        { id: 7, title: 'Movie 7', description: 'Description for movie 7' },
        { id: 8, title: 'Movie 8', description: 'Description for movie 8' },
        { id: 9, title: 'Movie 9', description: 'Description for movie 9' },
      ];
      setMovies(dummyMovies);
    };

    fetchMovies();
  }, [type, id]);

  return (
    <div className="page-container">
      <div className="content-container">
        <h2>{categoryName} 영화 목록</h2>

        {/* 다른 카테고리로 이동할 수 있는 버튼들 */}
        <div className="category-buttons">
          {otherCategories.map((category, index) => (
            <Link key={index} to={`/categories/${type}/${index + 1}`}>
            <button className="category-btn">{category}</button>
            </Link>
          ))}
        </div>

        {/* 영화 리스트 */}
        <div className="row movie-list mt-4">
          {movies.map(movie => (
            <div key={movie.id} className="col-6 col-sm-4 col-md-2 mb-4">
              <div className="movie-card h-100">
                <h5>{movie.title}</h5>
                <p>{movie.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
