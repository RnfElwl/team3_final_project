import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../../css/movies/MovieCategories.css'; // CSS 파일을 임포트

function MovieCategories() {
  const [activeTab, setActiveTab] = useState('genre');

  const genreCategories = [
    { id: 'romance', name: 'Romance' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'mystery', name: 'Mystery' },
  ];

  const yearCategories = [
    { id: '2020', name: '2020s' },
    { id: '2010', name: '2010s' },
    { id: '1990', name: '1990s' },

  ];

  const nationCategories = [
    { id: 'canada', name: 'Canada' },
    { id: 'france', name: 'France' },
    { id: 'china', name: 'China' },
    ];


  // 현재 선택된 탭에 따라 표시할 카테고리 결정
  let currentCategories = [];
  if (activeTab === 'genre') {
    currentCategories = genreCategories;
  } else if (activeTab === 'year') {
    currentCategories = yearCategories;
  } else if (activeTab === 'nation') {
    currentCategories = nationCategories;
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
              className={`nav-link ${activeTab === 'nation' ? 'active' : ''}`}
              onClick={() => setActiveTab('nation')}
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
