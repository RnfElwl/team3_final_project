import "../../css/community/communityList.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

function CommunityList() {
    const { community_no } = useParams(); // URL에서 community_no 가져오기
    const [community, setCommunity] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredCommunity, setFilteredCommunity] = useState([]); // 필터링된 커뮤니티 상태
    const categories = ["전체", "영화", "일상", "자유", "포스터"]; // 카테고리 목록에 "전체" 추가

    // 상위 3개 게시물
    const [topLikedPosts, setTopLikedPosts] = useState([]);
    const [topCommentedPosts, setTopCommentedPosts] = useState([]);

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
        // 커뮤니티 글 리스트 가져오기
        axios.get('http://localhost:9988/community/list')
            .then(response => {
                setCommunity(response.data);
                setFilteredCommunity(response.data);
                
                // 상위 3개 게시물 설정
                const sortedByLikes = [...response.data].sort((a, b) => b.likesCount - a.likesCount).slice(0, 3);
                const sortedByComments = [...response.data].sort((a, b) => b.commentCount - a.commentCount).slice(0, 3);
                
                setTopLikedPosts(sortedByLikes);
                setTopCommentedPosts(sortedByComments);
            })
            .catch(error => {
                console.error("Error fetching community list:", error);
            });
    }, []);

    // 좋아요 처리
    const handleLike = (community_no, liked) => {
        const likeData = {
            community_no: parseInt(community_no),
            userid: "test1234" // 현재 로그인된 사용자 ID
        };

        axios.post(`http://localhost:9988/community/like`, likeData)
            .then(() => {
                setCommunity(prevCommunity =>
                    prevCommunity.map(item =>
                        item.community_no === community_no
                            ? {
                                ...item,
                                liked: !liked, // 현재 좋아요 상태를 반전
                                likesCount: liked ? item.likesCount - 1 : item.likesCount + 1 // 좋아요 수를 업데이트
                            }
                            : item
                    )
                );
            })
            .catch(error => {
                console.error("Error liking community:", error);
            });
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // 검색어 상태 업데이트

        // 검색어에 따라 필터링
        if (value.trim() === "") {
            setFilteredCommunity(community); // 검색어가 비어있으면 모든 커뮤니티 표시
        } else {
            const filtered = community.filter(item => 
                item.community_title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCommunity(filtered); // 필터링된 커뮤니티 업데이트
        }
    };

    // 카테고리 클릭 시 필터링
    const filterByCategory = (category) => {
        if (category === "전체") {
            setFilteredCommunity(community); // "전체" 선택 시 모든 커뮤니티 표시
        } else {
            setFilteredCommunity(community.filter(item => getCategoryName(item.category) === category));
        }
    };  

    return (
        <div className="community_list">
            <div className="container">
                <div className="list_header">
                    <input 
                        className='search' 
                        type="text" 
                        placeholder="🔍 검색어를 입력하세요" 
                        value={searchTerm}
                        onChange={handleSearchInputChange} // 핸들러 연결
                    />
                    <Link to="/community/CommunityWrite">
                        <input className="write" type="button" value="글 작성하기" />
                    </Link>
                </div>
                <hr />

                {filteredCommunity.length > 0 ? (
                    filteredCommunity.map((communityItem) => (
                        <div className="list" key={communityItem.community_no}>
                            <div className="list_top">
                                <img className="writer_image" src={communityItem.writerImage} alt="Writer" />
                                <div className="writer_info">
                                    <div className="name_location">
                                        <p className="writer_name">{communityItem.userid}</p>
                                        <p className="location">{communityItem.loc}</p>
                                    </div>
                                    <p className="writedate">{communityItem.community_writedate}</p>
                                </div>
                                <input type="button" value="팔로우" className="action_button" />
                                <input type="button" value="신고" className="action_button" />
                            </div>
                            <Link to={`/community/communityView/${communityItem.community_no}`}>
                                <div className="list_middle">
                                    <div className="category">{getCategoryName(communityItem.category)}</div>
                                    <h3 className="community_title">{communityItem.community_title}</h3>
                                    {communityItem.community_img && (
                                        <img className="community_img" src={communityItem.community_img} alt="Uploaded" />
                                    )}
                                </div>
                            </Link>
                            <div className="list_bottom">
                                <i
                                    className={`like-icon ${communityItem.liked ? 'filled' : 'empty'}`}
                                    onClick={() => handleLike(communityItem.community_no, communityItem.liked, communityItem.likesCount)}
                                    style={{ fontStyle: 'normal', cursor: 'pointer' }}
                                >
                                    {communityItem.liked ? '♥' : '♡'}
                                </i>
                                <span className="likeCount">{isNaN(communityItem.likesCount) ? '0' : communityItem.likesCount}</span>

                                <i className="comment-icon" data-no={`${communityItem.community_no}`} style={{ fontStyle: 'normal' }}> 💬</i>
                                <span className="commentCount">{communityItem.commentCount}</span>
                                <i className="bookmark-icon" data-no={`${communityItem.community_no}`} style={{ fontStyle: 'normal' }}> 🔖</i>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>커뮤니티 글이 없습니다.</p> // 글이 없을 때 메시지
                )}
            </div>

            <div className="categories_and_top_posts">
                <div className="category_box">
                    {categories.map(category => (
                        <button key={category} onClick={() => filterByCategory(category)}>
                            {category}
                        </button>
                    ))}
                </div>
                
                {/* 댓글 많은 게시물 Top 3 */}
                <div className="top_posts">
                    <p>댓글 Top 3</p>
                    {topCommentedPosts.map((post, index) => (
                        <div key={post.community_no} className="top_post_item">
                            <Link to={`/community/communityView/${post.community_no}`}>
                                <p>{index + 1}. {post.community_title}</p> {/* 인덱스 + 1을 사용하여 번호 매기기 */}
                                {/* <span>{post.commentCount} 댓글</span> */}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* 좋아요 많은 게시물 Top 3 */}
                <div className="top_posts">
                    <p>좋아요 Top 3</p>
                    {topLikedPosts.map((post, index) => (
                        <div key={post.community_no} className="top_post_item">
                            <Link to={`/community/communityView/${post.community_no}`}>
                                <p>{index + 1}. {post.community_title}</p> {/* 인덱스 + 1을 사용하여 번호 매기기 */}
                                {/* <span>{post.likesCount} 좋아요</span> */}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityList;
