import "../../css/community/communityWrite.css";
import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

function CommunityWrite() {
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태
    const [places, setPlaces] = useState([]); // 검색된 장소 리스트
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 상태
    const [image, setImage] = useState(null); // 업로드된 이미지 상태
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(0); // 카테고리 번호
    const [privacy, setPrivacy] = useState(0); // 공개 대상 번호

    // Kakao Maps API를 활용한 장소 검색
    const handleSearch = () => {
        const ps = new window.kakao.maps.services.Places();
        
        ps.keywordSearch(searchKeyword, (data, status, _pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setPlaces(data); // 검색 결과를 상태에 저장
            } else {
                console.error('검색 결과가 없습니다.');
            }
        });
    };

     // 장소 선택 핸들러
     const handlePlaceSelect = (place) => {
        setSelectedPlace(place); // 선택된 장소 상태 업데이트
        setPlaces([]); // 검색 결과 리스트 비우기
        setSearchKeyword(place.place_name); // 입력란에 선택된 장소 이름 표시
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // 선택한 파일 가져오기
        const reader = new FileReader();

        // 이미지 미리보기
        reader.onloadend = () => {
            setImage(reader.result); // 이미지 상태 업데이트
        };

        if (file) {
            reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
        }
    };

    const handleSubmit = async () => {
        try {
            const postData = {
                userid: "testUser",  // 실제 로그인된 유저의 ID로 변경해야 함
                community_title: title,
                community_content: content,
                community_img: image,
                community_writedate: new Date().toISOString(),
                loc: selectedPlace ? selectedPlace.place_name : null,
                category,
                privacy
            };
            await axios.post('/api/community', postData);
            alert('게시글이 성공적으로 등록되었습니다.');
        } catch (error) {
            console.error('게시글 등록 실패:', error);
            alert('게시글 등록에 실패했습니다.');
        }
    };

    return (
        <div className="communityWrite-container">
            <div className="container">
                <div className="communityWrite-header">
                    <h2>새 게시물</h2>
                </div>
                <div className="communityWrite-form">
                    {/* 제목 입력 */}
                    <div className="communityWrite-title">
                        <input 
                        type="text" 
                        placeholder="제목을 입력하세요" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="title-input"
                        />
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="communityWrite-image">
                        {image && <img src={image} alt="미리보기" className="image-preview" />} {/* 선택한 이미지 미리보기 */}
                        <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} // 이미지 업로드 핸들러 추가
                        className="image-upload"
                        />
                    </div>

                    {/* 내용 입력 */}
                    <div className="communityWrite-content">
                        <textarea 
                        placeholder="내용을 작성하세요..." 
                        className="content-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <hr/>
                
                <div className="communityWrite-section">
                    {/* 카테고리 선택 */}
                    <div className="communityWrite-item">
                        <h4>📂 카테고리</h4>
                        <label>
                        <input type="radio" name="category" value={0} onChange={(e) => setCategory(e.target.value)} /> 영화
                        </label>
                        <label>
                        <input type="radio" name="category" value={1} onChange={(e) => setCategory(e.target.value)} /> 일상
                        </label>
                        <label>
                        <input type="radio" name="category" value={2} onChange={(e) => setCategory(e.target.value)} /> 자유
                        </label>
                        <label>
                        <input type="radio" name="category" value={3} onChange={(e) => setCategory(e.target.value)} /> 포스터
                        </label>
                    </div>

                    {/* 공개 대상 선택 */}
                    <div className="communityWrite-item">
                        <h4>👥 공개 대상</h4>
                        <label>
                        <input type="radio" name="audience" value={0} onChange={(e) => setPrivacy(e.target.value)} /> 전체공개
                        </label>
                        <label>
                        <input type="radio" name="audience" value={1} onChange={(e) => setPrivacy(e.target.value)} /> 팔로워공개
                        </label>
                    </div>

                    <div className="communityWrite-section">
                        {/* 위치 추가 */}
                        <div className="communityWrite-item">
                            <h4>📍 위치 추가</h4>
                            <input 
                                type="text" 
                                placeholder="장소를 검색하세요" 
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)} // 검색어 입력
                                className="location-input"
                            />
                            <button onClick={handleSearch} className="search-button">검색</button>

                            {/* 검색된 장소 리스트 표시 */}
                            {places.length > 0 && (
                                <ul className="places-list">
                                    {places.map((place) => (
                                        <li key={place.id} onClick={() => handlePlaceSelect(place)}>
                                            {place.place_name} ({place.address_name})
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* 선택된 장소 표시 */}
                            {selectedPlace && (
                                <div className="selected-place">
                                    <p className="loca">장소: {selectedPlace.place_name} ({selectedPlace.address_name})</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="communityWrite-footer">
                    <button onClick={handleSubmit} className="share-button">공유</button>
                </div>
            </div>
        </div>
    );
}

export default CommunityWrite;
