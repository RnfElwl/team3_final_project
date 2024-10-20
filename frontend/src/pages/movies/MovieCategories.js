import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../../css/movies/MovieCategories.css'; // CSS 파일을 임포트
import axios from 'axios';

function MovieCategories() {
  const [activeTab, setActiveTab] = useState('genre');
  const [yearCategories, setYearCategories] = useState([]);

  useEffect(() => {
    // Fetch year categories from backend (this could be a one-time fetch if year ranges are dynamic)
    axios.get(`http://localhost:9988/api/movies/yearCategories`)
      .then(response => {
        setYearCategories(response.data);
      })
      .catch(error => console.error("Error fetching year categories:", error));
  }, []);

  const genreCategories = [
    { id: '드라마', name: '드라마' },
    { id: '액션', name: '액션' },
    { id: '다큐멘터리', name: '다큐멘터리' },
    { id: '애니메이션', name: '애니메이션' },
    { id: '코미디', name: '코미디' },
    { id: '범죄', name: '범죄' },
    { id: '전쟁', name: '전쟁' },
    { id: '공포(호러)', name: '공포(호러)' },
    { id: '가족', name: '가족' },
    { id: '사극', name: '사극' },
    { id: 'SF', name: 'SF' },
    { id: '미스터리', name: '미스터리' },
    { id: '스릴러', name: '스릴러' }

  ];

  const nationCategories = [
    { id: '한국', name: '한국' },
    { id: '미국', name: '미국' },
    { id: '영국', name: '영국' },
    { id: '프랑스', name: '프랑스' },
    { id: '스페인', name: '스페인' },
    { id: '중국', name: '중국' },
    { id: '홍콩', name: '홍콩' },
    { id: '대만', name: '대만' },
    { id: '일본', name: '일본' },
    { id: '북유럽', name: '북유럽' },
    { id: '남미', name: '남미' }
    
    ];

  // 현재 선택된 탭에 따라 표시할 카테고리 결정
  let currentCategories = [];
  if (activeTab === 'genre') {
    currentCategories = genreCategories;
  } else if (activeTab === 'year') {
    currentCategories = yearCategories.length > 0 ? yearCategories : [
      { id: '2024', name: '올해의 영화' },
      { id: '2020', name: '2020년대' },
      { id: '2010', name: '2010년대' },
      { id: '1990', name: '1990년대' },
      { id: '1980', name: '1980년대' },
      { id: '1970', name: '1970년대' }

    ];
  } else if (activeTab === 'nation') {
    currentCategories = nationCategories;
  }

  return (
    <div className="page-container"> {/* 페이지 전체 배경 */}
      <div className="content-container"> {/* 1200px 중앙 정렬 div */}
        <h1>카테고리</h1>

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
        {/* <div className="row mt-4">
          {currentCategories.map(category => (
            <div key={category.id} className="col-6 col-sm-4 col-md-2 mb-4">
              <Link to={`/categories/${activeTab}/${category.id}`} className="card-link">
                <div className="card h-100">
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </Link>
            </div> */}
          {/* ))} */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default MovieCategories;
