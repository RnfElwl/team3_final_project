import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../../css/movies/MovieCategories.css'; // CSS 파일을 임포트

function MovieCategories() {
  const [activeTab, setActiveTab] = useState('genre');

  const genreCategories = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 3, name: 'Drama' },
    { id: 4, name: 'Horror' },
    { id: 5, name: 'Sci-Fi' },
    { id: 6, name: 'Documentary' },
    { id: 7, name: 'Thriller' },
    { id: 8, name: 'Animation' },
    { id: 9, name: 'Fantasy' },
    { id: 10, name: 'Adventure' },
    { id: 11, name: 'Romance' },
    { id: 12, name: 'Mystery' },
  ];

  const yearCategories = [
    { id: 1, name: '2020' },
    { id: 2, name: '2021' },
    { id: 3, name: '2022' },
    { id: 4, name: '2023' },
    { id: 5, name: '2024' },
    { id: 6, name: '2025' },
    { id: 7, name: '2026' },
    { id: 8, name: '2027' },
    { id: 9, name: '2028' },
    { id: 10, name: '2029' },
    { id: 11, name: '2030' },
    { id: 12, name: '2031' },
  ];

  const countryCategories = [
    { id: 1, name: 'USA' },
    { id: 2, name: 'UK' },
    { id: 3, name: 'France' },
    { id: 4, name: 'Germany' },
    { id: 5, name: 'Japan' },
    { id: 6, name: 'South Korea' },
    { id: 7, name: 'India' },
    { id: 8, name: 'Canada' },
    { id: 9, name: 'Australia' },
    { id: 10, name: 'Italy' },
    { id: 11, name: 'Spain' },
    { id: 12, name: 'Brazil' },
  ];

  let currentCategories;
  if (activeTab === 'genre') {
    currentCategories = genreCategories;
  } else if (activeTab === 'year') {
    currentCategories = yearCategories;
  } else if (activeTab === 'country') {
    currentCategories = countryCategories;
  }

  return (
    <div className="page-container"> {/* 페이지 전체 배경 */}
      <div className="content-container"> {/* 1200px 중앙 정렬 div */}
        <h1>Movie Categories</h1>

        {/* 탭 네비게이션 */}
        <ul className="nav nav-tabs mt-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'genre' ? 'active' : ''}`}
              onClick={() => setActiveTab('genre')}
            >
              장르별
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'year' ? 'active' : ''}`}
              onClick={() => setActiveTab('year')}
            >
              연도별
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'country' ? 'active' : ''}`}
              onClick={() => setActiveTab('country')}
            >
              국가별
            </button>
          </li>
        </ul>

        {/* 탭 콘텐츠 */}
        <div className="row mt-4">
          {currentCategories.map(category => (
            <div key={category.id} className="col-6 col-sm-4 col-md-2 mb-4">
              <Link to={`/categories/${activeTab}/${category.id}`} className="card-link">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieCategories;
