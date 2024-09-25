import "../../css/community/communityList.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

function CommunityList() {
    const [community, setCommunity] = useState([]);
    const [profile, setProfile] = useState({ nicName: "", profileImage: "" });

    useEffect(() => {
        // 프로필 정보 가져오기
        axios.get('/api/profile')
            .then(response => {
                setProfile({
                    nicName: response.data.nicName,
                    profileImage: response.data.profileImage
                });
            });

        // 커뮤니티 글 리스트 가져오기
        axios.get('/api/community')
            .then(response => {
                setCommunity(response.data); // community 상태 업데이트
            });
    }, []);

    return (
        <div className="community_list">
            <div className="container">
                <div className="list_header">
                    <img className="my_image" src={profile.profileImage} alt="My Profile" /> {/* 나의 프로필 사진 */}
                    <h3 className="my_name">{profile.nicName}</h3> {/* 나의 닉네임 */}
                    <input className='search' type="text" />
                    <p className="alt">🔔</p> {/* 알림 */}
                    <a href="/CommunityWrite"><input className="write" type="button" value="글 작성하기" /></a>
                    <hr />
                </div>
                {community.map((communityItem, index) => (
                    <div className="list" key={index}>
                        <Link to={`/community/communityView/${communityItem.no}`}> {/* 링크 경로 수정 */}
                            <div className="list_top">
                                <img className="writer_image" src={communityItem.writerImage} alt="Writer" /> {/* 게시자 사진 */}
                                <p>{communityItem.writerName}</p> {/* 게시자 닉네임 */}
                                <p>{communityItem.writedate}</p> {/* 업로드 일자 */}
                                <input type="button" value="팔로우" />
                                <input type="button" value="신고" />
                            </div>
                            <br />
                            <div className="list_middle">
                                <p>{communityItem.preface}</p> {/* 말머리 */}
                                <p>{communityItem.title}</p> {/* 제목 */}
                                <img src={communityItem.uploadedImage} alt="Uploaded" /> {/* 업로드한 사진 */}
                            </div>
                            <div className="list_bottom">
                                <i className="like-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> ♡</i> {/* 좋아요 */}
                                <span id="likeCount">{communityItem.likeHit}</span>
                                <i className="comment-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> 💬</i> {/* 댓글 */}
                                <span id="commentCount">{communityItem.commentHit}</span>
                                <i className="bookmark-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> 🔖</i> {/* 북마크 */}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommunityList;
