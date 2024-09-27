import "../../css/community/communityList.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

function CommunityList() {
    const [community, setCommunity] = useState([]);
    //const [profile, setProfile] = useState({ nicName: "", profileImage: "" });

    // category 값에 따른 카테고리 이름을 반환하는 함수
    const getCategoryName = (category) => {
        switch (category) {
            case 0:
                return "영화";
            case 1:
                return "일상";
            case 2:
                return "자유";
            case 3:
                return "포스터";
            default:
                return "기타";
        }
    };

    useEffect(() => {
        // 프로필 정보 가져오기
        // axios.get('/api/profile')
        //     .then(response => {
        //         setProfile({
        //             nicName: response.data.nicName,
        //             profileImage: response.data.profileImage
        //         });
        //     });

        // 커뮤니티 글 리스트 가져오기
        axios.get('http://localhost:9988/community/list')
            .then(response => {
                setCommunity(response.data); // community 상태 업데이트
            })
            .catch(error => {
                console.error("Error fetching community list:", error);
            });
    }, []);

    return (
        <div className="community_list">
            <div className="container">
                <div className="list_header">
                    {/* <img className="my_image" src={profile.profileImage} alt="My Profile" /> 나의 프로필 사진 */}
                    {/* <h3 className="my_name">{profile.nicName}</h3> 나의 닉네임 */}
                    <input className='search' type="text" placeholder="🔍 검색어를 입력하세요"/>
                    <p className="alt">🔔</p> {/* 알림 */}
                    <Link to="/community/CommunityWrite">
                        <input className="write" type="button" value="글 작성하기" />
                    </Link>
                </div>
                <hr />

                {community.length > 0 ? (
                    community.map((communityItem) => (
                        <div className="list" key={communityItem.no}>
                            <Link to={`/community/communityView/${communityItem.no}`}>
                                <div className="list_top">
                                    <img className="writer_image" src={communityItem.writerImage} alt="Writer" />
                                    <div className="writer_info">
                                        <p className="writer_name">{communityItem.userid}</p>
                                        <p className="writedate">{communityItem.community_writedate}</p>
                                    </div>
                                    <input type="button" value="팔로우" className="action_button" />
                                    <input type="button" value="신고" className="action_button" />
                                </div>

                                <div className="list_middle">
                                    <div className="category">{getCategoryName(communityItem.category)}</div>
                                    <h3 className="community_title">{communityItem.community_title}</h3>
                                    {communityItem.community_img && (
                                        <img className="community_img" src={communityItem.community_img} alt="Uploaded" />
                                    )}
                                </div>

                                <div className="list_bottom">
                                    <i className="like-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> ♡</i>
                                    <span className="likeCount">{communityItem.likeHit}</span>
                                    <i className="comment-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> 💬</i>
                                    <span className="commentCount">{communityItem.commentHit}</span>
                                    <i className="bookmark-icon" data-no={`${communityItem.no}`} style={{ fontStyle: 'normal' }}> 🔖</i>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>커뮤니티 글이 없습니다.</p> // 글이 없을 때 메시지
                )}
            </div>
        </div>
    );
}

export default CommunityList;
