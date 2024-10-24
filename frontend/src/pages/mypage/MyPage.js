import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import CustomImage from '../../component/CustomImage';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FaHeart, FaRegHeart,  } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import { SliderSettings, AdaptiveHeightSettings } from '../../component/api/SliderSetting';
// import { recentSlides, bookmarkSlides, useprofileSlides  } from '../../component/api/SliderSetting';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../../css/mypage/mypage.css';
import profile from '../../img/profile.png';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../../component/api/Modal';

function Mypage() {

    const [recentSlidesData, setRecentSlides] = useState([]);
    const [bookmarkSlidesData, setBookmarkSlides] = useState([]);
    const [profileSlidesData, setProfileSlides] = useState([]);
    const [isLiked, setIsLiked] = useState(true);
    
    // 글, 댓글 불러올거
    const [tagName, setTagName] = useState("Tag1");
    const [list, setList] = useState([]);
    const [userInfo, setUserInfo] = useState({      // 초기 본인정보 끌어오기
        usernick: '',
        username: '',
        usertel: '',
        useremail: '',
        useraddr: '',
        addrdetail: '',
        userprofile : ''
    });
    const [qnaList, setQnaList] = useState([]);
    const [communityList, setCommunityList] = useState([]);
    const [commentList, setcommentList] = useState([]);
    const [likecommunityList, setlikeCommunityList] = useState([]);
    const [profileImageSrc, setProfileImageSrc] = useState('');
    const defaultProfileImage = profile;

    useEffect(() => {   // 제일 처음 사용자 이미지 값 불러오기

        fetchUserInfo();
        fetchtotaldata();
    
    }, []);
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get("http://localhost:9988/user/mypageinfo");
            const userInfo = response.data;

            const updatedUserInfo = {
            ...userInfo,
            };

        setUserInfo(updatedUserInfo);
        setProfileImageSrc(updatedUserInfo.userprofile || defaultProfileImage);
        console.log(profileImageSrc);

        console.log(updatedUserInfo);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error.response.data); // "Access denied." 메시지 확인
                if (error.response.data === "Access denied. token expired") {
                    window.location = "/"; // 토큰 만료 시 리다이렉트
                }
            }else{
            console.error("Error fetching data: ", error);
            }
        }
    };

    const fetchtotaldata = async () => {
        try {
            const response = await axios.get("http://localhost:9988/user/totaldata"); // Change to your bookmarks API
            console.log(response.data);
            console.log(response.data.bookmarks);
            console.log(response.data.history);
            console.log(response.data.followers);
            if (Array.isArray(response.data.bookmarks)) {
                setBookmarkSlides(response.data.bookmarks);
            }
            if (Array.isArray(response.data.history)) {
                setRecentSlides(response.data.history);
            }
            if (Array.isArray(response.data.followers)) {
                setProfileSlides(response.data.followers);
            }
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                bookmark_n: response.data.bookmark_n,
                community: response.data.community,
                follower: response.data.follower,
                following: response.data.following,
                comment: response.data.comment,
            }));
            if (Array.isArray(response.data.qnalist)) {
                setQnaList(response.data.qnalist);
              }
              if (Array.isArray(response.data.commentlist)) {
                setcommentList(response.data.commentlist);
              }
              if (Array.isArray(response.data.communitylist)) {
                setCommunityList(response.data.communitylist);
              }
              if (Array.isArray(response.data.likecommunitylist)) {
                setlikeCommunityList(response.data.likecommunitylist);
                setLikeStatus(response.data.likecommunitylist.map(() => true));
              }
        } catch (error) {
            console.error("Error fetching: ", error);
        }
    };

    const handleProfileImageError = () => {
        setProfileImageSrc(defaultProfileImage); // 이미지 로드 실패 시 기본 이미지로 설정
        console.log(profileImageSrc);
    };

    const navigate = useNavigate();

    // 데이터를 초기화하는 useEffect 추가
    useEffect(() => {
        // 초기 데이터 설정
        // setRecentSlides(recentSlides);
        //setBookmarkSlides(bookmarkSlides);
        // setProfileSlides(useprofileSlides);
    }, []);
    while (recentSlidesData.length < 5 && recentSlidesData.length != 0){
        recentSlidesData.push({ imgSrc: "empty", className: "empty-slide"});
    }
    while (bookmarkSlidesData.length < 5 && bookmarkSlidesData.length != 0){
        bookmarkSlidesData.push({ imgSrc: "empty", className: "empty-slide"});
    }
    while (profileSlidesData.length < 7) {
        profileSlidesData.push({ imgSrc: "empty", usernick: "", className: "empty-slide" , userid : ""}); // 빈 슬라이드 추가
    }
    
    // 모달용
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState([]); // 사용자 목록
    const [currentList, setCurrentList] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    const handleOpenModal = (type) => {
        fetchUserList(type);
        setIsModalOpen(true);
    };
    const fetchUserList = async (type) => {
        console.log(userInfo.usernick);
        console.log(type);
        try {
            const endpoint = type === 'following' ? 'followers' : 'following';
            const response = await axios.get(`http://localhost:9988/user/info/f/${endpoint}`, {
                params:  {usernick: userInfo.usernick}
            });
            const userList = response.data;
            console.log(response.data);

            setCurrentList(response.data);
            setUserList(response.data);
            setModalTitle(type === 'following' ? '팔로잉 목록' : '팔로워 목록');
        } catch (error) {
            console.error("Error fetching user list:", error);
        }
    };
    const toggleFollow = (user) => {
        // 현재 팔로우 상태를 토글하여 새 상태를 설정
        const updatedList = currentList.map((u) => {
            if (u.follow_user_nick === user.follow_user_nick) {
                return {
                    ...u,
                    is_follower: u.is_follower === "1" ? "0" : "1", // 팔로우 상태 변경
                };
            }
            return u;
        });
        
        setCurrentList(updatedList);
    
        // 서버에 변경된 팔로우 상태를 전송 (axios 사용)
        axios.post('http://localhost:9988/user/info/toggleFollow', {
            follow_user_nick: user.follow_user_nick,
            newStatus: user.is_follower === "1" ? "0" : "1"
        })
        .then(response => {
            console.log(response.data); // 성공 응답 처리
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                if (error.response.data === "Need login") {
                    // 로그인 필요 시 로그인 페이지로 리디렉션
                    alert("팔로우 기능은 로그인이 필요합니다.");
                    window.location.href = "/signin"; // 로그인 페이지 경로
                } else {
                    // 400 오류가 발생하면 상태 복구
                    const restoredList = currentList.map((u) => {
                        if (u.follow_user_nick === user.follow_user_nick) {
                            return {
                                ...u,
                                is_follower: u.is_follower === "1" ? "0" : "1", // 원래 상태로 복구
                            };
                        }
                        return u;
                    });
                    setCurrentList(restoredList);
                    alert("팔로우 상태를 업데이트하는 데 실패했습니다."); // 실패 메시지
                }
            } else {
                // 다른 에러 처리 (네트워크 오류 등)
                console.error('Error toggling follow status:', error);
                const restoredList = currentList.map((u) => {
                    if (u.follow_user_nick === user.follow_user_nick) {
                        return {
                            ...u,
                            is_follower: u.is_follower === "1" ? "0" : "1", // 원래 상태로 복구
                        };
                    }
                    return u;
                });
                setCurrentList(restoredList);
                alert("팔로우 상태를 업데이트하는 중 에러가 발생했습니다."); // 에러 메시지
            }
        });
    };

    const [likeStatus, setLikeStatus] = useState(
        likecommunityList.map(() => false)
    );
    const toggleLike = async (index, community) => {
        console.log(index, community);
        const previousLikeStatus = [...likeStatus];
        try {
            const response = await axios.get('http://localhost:9988/community/like/status', {
                params: { community_no: community.community_no }
            });

            const isLiked = response.data;
            const updatedLikeStatus = [...likeStatus];
            updatedLikeStatus[index] = isLiked;
            setLikeStatus(updatedLikeStatus);

            console.log('좋아요 상태 변경 응답:', response.data);
    
            console.log('Toggle Like Response:', response.data);
        } catch (error) {
            console.error('Error toggling like:', error);
            setLikeStatus(previousLikeStatus);
        }
    };
    const toggledelete = async (index, info, type) => {
        console.log(index, info, type);
        let params = {};
    
        // type에 따라 params 값 설정
        if (type === "qna") {
            params = { no: info.qna_no };
        } else if (type === "community") {
            params = { no: info.community_no };
        } else if (type === "comment") {
            params = { no: info.comment_no };
        }
        console.log(params);
    
        try {
            const response = await axios.get(`http://localhost:9988/user/del/${type}`, {
                params: params
            });
    
            if (response.status === 200) {
                console.log('삭제 성공:', response.data);
                // 필요 시 전체 데이터를 다시 가져오는 로직
                fetchUserInfo();
                fetchtotaldata();
            } else {
                alert("삭제 실패");
                console.log('삭제 실패:', response.data);
            }
        
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.error('서버 에러:', error.response.data);
            } else if (error.response && error.response.status === 400) {
                if (error.response.data === "Need login") {
                    console.log("로그인 필요, 로그인 페이지로 이동");
                    window.location.href = "/signin";
                } else {
                    console.error('잘못된 요청:', error.response.data);
                }
            } else {
                console.error('알 수 없는 오류:', error.message);
            }
        }
    
    };
    

    return (
        <div className="myPage">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "info">
                    <div id = "profile">
                        <CustomImage src = {profileImageSrc} alt = {profile} onError={handleProfileImageError}/>
                        <span>{userInfo.usernick}님</span>
                    </div>
                    <div id = "userinfo">
                        <div className = "usertop">
                            <p>이름 : <span>{userInfo.username}</span></p>
                            <p>주소 : <span>{userInfo.useraddr}</span></p>
                            <p>전화번호 : <span>{userInfo.usertel}</span></p>
                            <p>이메일 : <span>{userInfo.useremail}</span></p>
                        </div>
                        <div className = "userbottom">
                            <p className = "fol" onClick={() => handleOpenModal('followers')}>팔로워 : <span>{userInfo.follower}</span></p>
                            <p className = "fol" onClick={() => handleOpenModal('following')}>팔로잉 : <span>{userInfo.following}</span></p>
                            <p>게시글 : <span>{userInfo.community}</span></p>
                            <p>댓글 : <span>{userInfo.comment}</span></p>
                        </div>
                    </div>
                    <div id = "info_change">
                        <button className="btn btn-secondary" onClick={() => navigate('/mypage/edit')}><FontAwesomeIcon icon={faPenToSquare} />관리하기</button>
                    </div>
                </div>
                <div className = "otherinfo">
                    {/* 시청기록 */}
                    <div className = "recent_watch">
                        <div className = "content_title">
                            <span>시청기록</span>
                            {recentSlidesData.length >= 10 && (
                                <Link to="/mypage/recentwatch"> 더보기 {'>'}</Link>
                            )}
                        </div>
                        <div className="content_info">
                        {recentSlidesData.length > 0 ? (
                            <Slider {...SliderSettings}>
                                {recentSlidesData.map((slide, index) => (
                                    <div key={index}>
                                        <Link to={`/movies/view/${slide.movie_code}`}>
                                            <img className="slidPoster" src={slide.movie_link} alt={slide.movie_kor || "empty"} />
                                        </Link>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <div className="noslide">
                                <BsExclamationCircle />
                                <p>시청기록이 없습니다</p>
                            </div>
                        )}
                        
                        </div>
                    </div>
                    {/* 즐겨찾기 */}
                    <div className = "bookmark">
                        <div className = "content_title">
                            <span>즐겨찾기</span>
                            {userInfo.bookmark_n >= 10 && (
                                <Link to="/mypage/bookmarked"> 더보기 {'>'}</Link>
                            )}
                        </div>
                        <div className="content_info">
                        {bookmarkSlidesData.length > 0 ? (
                            <Slider {...SliderSettings}>
                                {bookmarkSlidesData.map((slide, index) => (
                                    <div key={index}>
                                        <Link to={`/movies/view/${slide.movie_code}`}>
                                            <img src={slide.movie_link} alt={slide.movie_kor || "empty"} className="slidPoster" />
                                        </Link>
                                    </div>
                                ))}
                            </Slider>
                             ) : (
                                <div className="noslide">
                                    <BsExclamationCircle />
                                    <p>즐겨찾기가 없습니다</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* 즐찾 회원 */}
                    {isModalOpen && (
                        <Modal onClose={() => setIsModalOpen(false)} title={modalTitle}>
                        {currentList.length > 0 ? (
                        <ul className="user-list-ul">
                            {currentList.map((user, index) => {
                                const isMutual = user.is_follower === "1"; // 개별 사용자에 대한 팔로우 상태 확인
                                return (
                                    <li key={index} className="user-list">
                                        <Link to={`/user/info/${user.follow_user_nick}`} onClick={()=>setIsModalOpen(false)}>
                                            <img src={user.follow_user_image} alt={user.follow_user_nick} />
                                            <span>{user.follow_user_nick}</span>
                                        </Link>
                                        <button 
                                            style={{ 
                                                backgroundColor: isMutual ? '#f7f7f7' : 'transparent',
                                                border : isMutual? '' : '1px solid white',
                                                color: isMutual ? 'black' : 'white' 
                                            }}
                                            onClick={() => toggleFollow(user)}
                                        >
                                            {isMutual ? '팔로잉' : '팔로우'}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        ) : (
                            <div className="noslide no-hover" style = {{height : "300px", marginTop : '20px'}}>
                                <BsExclamationCircle />
                                <p>{modalTitle}이 없습니다.</p>
                            </div>
                        )}
                    </Modal>
                        )}
                    {/* 사등분 */}
                    <div className = "content_title" style={{margin : "50px auto 0 auto"}}>
                            <span></span>
                            <Link to="mypost"> 더보기 {'>'}</Link>
                    </div>
                    <div className = "board">
                        <div className = "write_4">
                            <div className = "content_title">
                                <span>게시글</span>
                            </div>
                            <div className = "content_info">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th className = "col-md-1"></th>
                                        
                                    </tr>
                                </thead>
                                {communityList.length > 0 ? (
                                <tbody>
                                {communityList.map((communitylist, index) => (
                                    <tr key={index}>
                                        <th>
                                            <ul className="custom-list">
                                                <li className="list_title"
                                                    onClick={() => navigate(`/community/communityView/${communitylist.community_no}`)} style={{ cursor: 'pointer' }}>
                                                    <div>{communitylist.community_title}</div>
                                                    <FontAwesomeIcon icon={faTrashCan} onClick={(event) => {event.stopPropagation(); alert("delete"); toggledelete(index, communitylist, "community");}}/>
                                                </li>
                                                <li className="smaller-text">
                                                <div className = "text-content" dangerouslySetInnerHTML={{ __html: String(communitylist.community_content) }} />
                                                </li>
                                            </ul>
                                        </th>
                                    </tr>
                                    ))}
                                </tbody>
                                ) : (
                                    <div className="noslide no-hover" style = {{height : "190px", marginTop : '20px'}}>
                                        <BsExclamationCircle />
                                        <p>작성한 게시글이 없습니다.</p>
                                    </div>
                                )}
                            </table>
                            </div>
                        </div>

                        <div className = "comm_4">
                        <div className = "content_title">
                                <span>댓글</span>
                            </div>
                            <div className = "content_info">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th className = "col-md-1"></th>
                                        
                                    </tr>
                                </thead>
                                {communityList.length > 0 ? (
                                <tbody>
                                {commentList.map((commentlist, index) => (
                                    <tr key={index}>
                                        <th>
                                            <ul className="custom-list">
                                                <li className="list_title"
                                                    onClick={() => navigate(`/community/communityView/${commentlist.community_no}`)} style={{ cursor: 'pointer' }}>
                                                    <div>{commentlist.community_title}</div>
                                                    <FontAwesomeIcon icon={faTrashCan} onClick={(event) => {event.stopPropagation(); alert("delete"); toggledelete(index, commentlist, "comment");}}/>
                                                </li>
                                                <li className="smaller-text">
                                                    <div className = "text-content" dangerouslySetInnerHTML={{ __html: String(commentlist.community_content) }} />
                                                </li>
                                            </ul>
                                        </th>
                                    </tr>
                                    ))}
                                </tbody>
                                ) : (
                                    <div className="noslide no-hover" style = {{height : "190px", marginTop : '20px'}}>
                                        <BsExclamationCircle />
                                        <p>작성한 댓글이 없습니다.</p>
                                    </div>
                                )}
                            </table>
                            </div>
                        </div>
                        <div className = "comm_like_4">
                        <div className = "content_title">
                                <span>커뮤니티 좋아요</span>
                            </div>
                            <div className = "content_info">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th className = "col-md-1"></th>
                                        
                                    </tr>
                                </thead>
                                {likecommunityList.length > 0 ? (
                                <tbody>
                                {likecommunityList.map((likecommunitylist, index) => (
                                    <tr key={index}>
                                        <th>
                                            <ul className="custom-list">
                                                <li className ="list_title"
                                                    onClick={() => navigate(`/community/communityView/${likecommunitylist.community_no}`)} style={{ cursor: 'pointer' }}>
                                                    <div>{likecommunitylist.community_title}</div>
                                                    {likeStatus[index] ? (
                                                        <FaHeart
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                toggleLike(index, likecommunitylist);
                                                            }}
                                                        />
                                                    ) : (
                                                        <FaRegHeart
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                toggleLike(index, likecommunitylist);
                                                            }}
                                                        />
                                                    )}
                                                </li>
                                                <li className="smaller-text">
                                                    <div className = "text-content" dangerouslySetInnerHTML={{ __html: String(likecommunitylist.community_content) }} />
                                                </li>
                                            </ul>
                                        </th>
                                    </tr>
                                    ))}
                                </tbody>
                                ) : (
                                    <div className="noslide no-hover" style = {{height : "190px", marginTop : '20px'}}>
                                        <BsExclamationCircle />
                                        <p>좋아요한 게시글이 없습니다.</p>
                                    </div>
                                )}
                            </table>
                            </div>
                        </div>
                        <div className = "qna_4">
                        <div className = "content_title">
                                <span>QnA</span>
                            </div>
                            <div className = "content_info">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th className = "col-md-1"></th>
                                        
                                    </tr>
                                </thead>
                                    {qnaList.length > 0 ? (
                                    <tbody>
                                    {qnaList.map((qna, index) => (
                                        <tr key={index}>
                                            <th>
                                                <ul className="custom-list">
                                                    <li className="list_title"
                                                    onClick={() => navigate(`/qna/view/${qna.qna_no}`, { state: { result: 1 } })} style={{ cursor: 'pointer' }}>
                                                        <div>
                                                            <span>[{qna.head_title == 1 ? "영화" : (qna.head_title == 2 ? "사이트" : "기타")}] </span>
                                                            {qna.qna_title}
                                                        </div>
                                                        <FontAwesomeIcon icon={faTrashCan} onClick={(event) => {event.stopPropagation(); alert("working"); toggledelete(index, qna, "qna");}} />
                                                    </li>
                                                    <li className="smaller-text" style ={{display:'flex', justifyContent: 'space-between'}}>
                                                        <div className = "text-content">{qna.qna_content}</div>
                                                        <div className="right-align">{qna.qna_state == 1 ? "답변 됨" : "답변 없음"}</div>
                                                    </li>
                                                </ul>
                                            </th>
                                        </tr>
                                    ))}
                                    </tbody>
                                    ) : (
                                        <div className="noslide no-hover" style = {{height : "190px", marginTop : '20px'}}>
                                            <BsExclamationCircle />
                                            <p>작성한 문의글이 없습니다.</p>
                                        </div>
                                    )}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        </div>

    );
}
export default Mypage;