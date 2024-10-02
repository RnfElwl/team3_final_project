import "../../css/community/communityList.css";
import React, { useState, useEffect } from 'react';
// import axios from "axios";
import axios from '../../component/api/axiosApi';
import { useParams, Link } from 'react-router-dom';

function CommunityList() {
    const { community_no } = useParams(); // URL에서 community_no 가져오기
    const [community, setCommunity] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredCommunity, setFilteredCommunity] = useState([]); // 필터링된 커뮤니티 상태
    const categories = ["전체", "영화", "일상", "자유", "포스터"]; // 카테고리 목록에 "전체" 추가
    const userid = localStorage.getItem('userid');
    const userprofile = localStorage.getItem('userprofile');
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [likesCount, setLikesCount] = useState(0); // 좋아요 수
    const [comments, setComments] = useState([]); // 댓글 상태 추가

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

    // 검색창
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

    //북마크
    const [bookmarked, setBookmarked] = useState(false);

    const handleBookmarkToggle = () => {
        setBookmarked(!bookmarked); // 북마크 상태 토글
    };

    // 댓글 수 계산
    const commentCount = comments.length;

    // 좋아요 처리
    const handleLikeToggle = async () => {
        // if (!userid) {
        //     console.error('사용자가 로그인하지 않았습니다.');
        //     return; // userid가 없으면 처리 중지
        // }

        try {
            const isLikedResponse = await axios.get(`http://localhost:9988/community/like/status`, {
                params: { community_no, userid }
            });
            console.log("좋아요 결과"+isLikedResponse.data);
            setLiked(isLikedResponse.data);
            // const isLiked = isLikedResponse.data > 0; // 이미 좋아요가 있다면 true
            
            // if (isLiked) {
            //     // 좋아요 삭제로
            //     await axios.delete(`http://localhost:9988/community/unlike`, { params: { community_no, userid } });
            // } else {
            //     // 좋아요 추가
            //     await axios.post(`http://localhost:9988/community/like`, { community_no, userid });
            // }

            // 좋아요 수 업데이트
            const likesCountResponse = await axios.get(`http://localhost:9988/community/likes/count/${community_no}`);
            setLikesCount(likesCountResponse.data); // 업데이트된 좋아요 수
            console.log("좋아요 수"+likesCountResponse);
            //setLiked(!isLiked); // 좋아요 상태 업데이트
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
    };

    return (
        <div className="community_list">
            <div className="container">
                <div className="list_header">
                    <img className="user_image" src={userprofile || '/default_profile.png'} alt="User Profile"/>
                    <p className="user_name">{userid}</p>
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
                                <img className="writer_image" src={communityItem.userprofile} alt="Writer" />
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
                                    className={`fa-heart ${liked ? 'fas' : 'far'}`}  // fas는 채워진 하트, far는 빈 하트
                                    onClick={handleLikeToggle}
                                    style={{ 
                                        color: liked ? 'red' : 'black',  // 좋아요 상태에 따라 하트 색상 변경
                                        cursor: 'pointer' 
                                    }}
                                ></i>
                                <span className="likeCount">{likesCount}</span>
                                <i className="far fa-comment"></i>
                                <span className="commentCount">{commentCount}</span>
                                <i 
                                    className={`fa-bookmark ${bookmarked ? 'fas' : 'far'}`}  // fas는 채워진 북마크, far는 빈 북마크
                                    onClick={handleBookmarkToggle}// 북마크 상태를 토글하는 함수
                                    style={{ 
                                        color: bookmarked ? 'black' : 'black',  // 북마크 상태에 따라 색상 변경 (blue: 활성화, gray: 비활성화)
                                        cursor: 'pointer' 
                                    }}
                                ></i>
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
