import "../../css/community/communityEdit.css";
import React, { useState, useEffect } from 'react';
// import axios from "axios";
import axios from '../../component/api/axiosApi';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@fortawesome/fontawesome-free/css/all.css';

function CommunityEdit() {
    const navigate = useNavigate();
    const { community_no } = useParams(); // 수정할 게시글의 번호를 가져옴
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태
    const [places, setPlaces] = useState([]); // 검색된 장소 리스트
    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 상태
    const [com_img, setCom_Image] = useState(null);
    const [image, setImage] = useState(null); // 업로드된 이미지 상태
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(0); // 기본 카테고리 번호
    const [privacy, setPrivacy] = useState(0); // 기본 공개 대상 번호
    const userid = localStorage.getItem('userid');
    const [comments, setComments] = useState([]); // 댓글 상태

    // 게시글 데이터 가져오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/community/view/${community_no}`);
                const postData = response.data;
    
                console.log("Fetched post data:", postData); // 데이터 로그 확인
    
                // 이전에 작성한 내용 세팅
                setTitle(postData.community_title || ''); // 제목
                setContent(postData.community_content || ''); // 내용
                setImage(postData.community_img || ''); // 이미지
                setSelectedPlace({ place_name: postData.loc || '', address_name: postData.address || '' }); // 장소
                setCategory(postData.category || 0); // 카테고리
                setPrivacy(postData.privacy || 0); // 공개 설정
            } catch (error) {
                console.error('게시글을 불러오는 데 실패했습니다:', error);
            }
        };
    
        fetchPost();
    }, [community_no]);

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
        // const file = e.target.files[0]; // 선택한 파일 가져오기
        // const reader = new FileReader();
        const file = Array.from(e.target.files); // FileList를 배열로 변환
        setCom_Image(file);
        const imagePreviews = file.map(file => URL.createObjectURL(file));
        setImage(imagePreviews);
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/community/comments/${community_no}`);
                setComments(response.data); // 댓글 데이터를 상태에 저장
            } catch (error) {
                console.error('댓글 불러오기 실패:', error);
            }
        };
    
        fetchComments();
    }, [community_no]);

    // 수정된 게시글 저장
    const handleSubmit = async () => {
        // 유효성 검사
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 작성해주세요.');
            return;
        }
        if (category === null) {
            alert('카테고리를 선택해주세요.');
            return;
        }
        if (privacy === null) {
            alert('공개 대상을 선택해주세요.');
            return;
        }
        if (image === null) {
            alert('사진을 첨부해주세요.');
            return;
        }
        // if (!userid) {
        //     alert('로그인이 필요합니다.');
        //     navigate('/signin'); // 로그인이 필요한 페이지로 이동
        //     return;
        // }

        try {
            const postData = new FormData();
            postData.append('userid', userid);
            postData.append('community_title', title);
            postData.append('community_content', content);
            postData.append('community_writedate', new Date().toISOString());
            postData.append('loc', selectedPlace ? selectedPlace.place_name : null);
            postData.append('category', parseInt(category, 10));
            postData.append('privacy', parseInt(privacy, 10));
            
            com_img.forEach((img, index) => {
                postData.append(`community_img`, img);
            });
            console.log(postData);
            // const result = await axios.post('http://localhost:9988/community/create', postData);
            const result = await axios.put(`http://localhost:9988/community/edit/${community_no}`, postData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // multipart/form-data 헤더를 설정
                },
            });
            console.log(result);
            alert('게시글이 성공적으로 수정되었습니다.');

            // 업로드 성공 후 게시글 페이지로 이동
            navigate(`/community/communityView/${community_no}`);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('게시글 수정에 실패했습니다.');
        }

        let finalContent = content;
    if (finalContent.startsWith('<p>') && finalContent.endsWith('</p>')) {
        finalContent = finalContent.slice(3, -4);
    }

    // 최종 처리된 데이터를 사용해 제출
    console.log(finalContent);
    };

    return (
        <div className="communityWrite-container">
            <div className="container">
                <div className="communityWrite-header">
                    <h3>Edit Post</h3>
                </div>
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

                    {/* 내용 입력 */}
                    <div className="communityWrite-content">
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setContent(data);
                            }}
                        />
                    </div>

                    {/* 이미지 업로드 */}
                    <div className="communityWrite-image">
                        {image && <img src={image} alt="미리보기" className="image-preview" />} 
                        <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="image-upload"
                        />
                    </div>
                
                <div className="communityWrite-section">
                    {/* 카테고리 선택 */}
                    <div className="communityWrite-item">
                        <h4><i className="fas fa-folder-open"></i> Category</h4>
                        <label>
                        <input type="radio" name="category" value={0} onChange={() => setCategory(0)} /> Movies
                        </label>
                        <label>
                        <input type="radio" name="category" value={1} onChange={() => setCategory(1)} /> Daily
                        </label>
                        <label>
                        <input type="radio" name="category" value={2} onChange={() => setCategory(2)} /> Free
                        </label>
                    </div>

                    {/* 공개 대상 선택 */}
                    <div className="communityWrite-item">
                        <h4><i className="fas fa-users"></i> Public</h4>
                        <label>
                        <input type="radio" name="audience" value={0} onChange={() => setPrivacy(0)} /> 전체 공개
                        </label>
                        <label>
                        <input type="radio" name="audience" value={1} onChange={() => setPrivacy(1)} /> 팔로워 공개
                        </label>
                    </div>

                    <div className="communityWrite-section">
                        {/* 위치 추가 */}
                        <div className="communityWrite-item">
                            <h4><i className="fas fa-map-marked-alt"></i> Location</h4>
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
                    <button onClick={handleSubmit} className="share-button">수정</button>
                </div>
            </div>
        </div>
    );
}

export default CommunityEdit;
