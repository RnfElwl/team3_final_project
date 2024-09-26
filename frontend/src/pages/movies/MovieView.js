import React, { useState } from 'react';

import {useParams } from 'react-router-dom';
import './../../css/movies/MovieView.css';
import { FaStar } from 'react-icons/fa'; // 별 아이콘을 위해 react-icons 사용

function MovieView() {
    // const { id } = useParams(); // id는 영화 ID를 의미
    // const movie = movies.find((m) => m.id === parseInt(id));

    // 탭 구분
    const [activeTab, setActiveTab] = useState('details'); 




    return (
        <div className="movie-view-container">
        <div className="movie-content">
          {/* 대표 이미지 */}
        <div className="movie-image">
            <img src="https://via.placeholder.com/1200x600" alt="Movie Poster" />
        </div>

          {/* 영화 제목과 버튼들 */}
        <div className="movie-details">
            <div className="movie-title">
                <h1>영화 제목</h1>
            </div>

            <div className="movie-info">
                <div className="rating-info">
                    <FaStar className="star-icon" /> 4.5 (200) {/* 평균 평점과 평점 개수 */}
                </div>
                <div className="info-details">
                    <span>  액션</span> {/* 장르 */}
                    <span>|  2023</span> {/* 개봉년도 */}
                    <span>|  120분</span> {/* 러닝타임 */}
                    <span>|  15세 이상</span> {/* 관람등급 */}
                </div>
            </div>

            <div className="movie-actions">
            <button className="action-btn">찜하기</button>
            <button className="action-btn">공유하기</button>
            </div>
        </div>

        <div className="watch-button-container">
            <button className="watch-btn">보러가기</button>
        </div>

        {/* 탭 메뉴 */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            영화 상세 정보
          </button>
          <button
            className={`tab-btn ${activeTab === 'poster' ? 'active' : ''}`}
            onClick={() => setActiveTab('poster')}
          >
            영화 포스터 구매하기
          </button>
        </div>

        {/* 탭 내용 */}
        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="movie-details-info">
              {/* 시놉시스 */}
              <div className="info-section">
                <h3>시놉시스</h3>
                <p>영화에 대한 간략한 내용이 여기에 표시됩니다.</p>
              </div>
              
              {/* 장르 */}
              <div className="info-section">
                <h3>장르</h3>
                <div className="genre-buttons">
                  <button className="genre-btn">뮤지컬</button>
                  <button className="genre-btn">로맨스</button>
                </div>
              </div>
              
              {/* 출연진 */}
              <div className="info-section">
                <h3>출연진</h3>
                <p>배우1, 배우2, 배우3</p>
              </div>

              {/* 감독 */}
              <div className="info-section">
                <h3>감독</h3>
                <p>감독 이름</p>
              </div>

              {/* 추가 정보 */}
              <div className="info-section">
                <h3>추가 정보</h3>
                <p>기타 내용이 여기에 표시됩니다.</p>
              </div>
            </div>
          )}

          {activeTab === 'poster' && (
            <div className="movie-poster-info">
              <p>영화 포스터 구매 정보가 여기에 표시됩니다.</p>
            </div>
          )}
        </div>








        </div>
    </div>
    );
}

export default MovieView;