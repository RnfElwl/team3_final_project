import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsExclamationCircle } from "react-icons/bs";
import Slider from "react-slick";
import { SliderSettings, AdaptiveHeightSettings } from '../../component/api/SliderSetting';
import { recentSlides, bookmarkSlides, useprofileSlides  } from '../../component/api/SliderSetting';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../../css/mypage/User.css';
import profile from '../../img/profile.png';
import Modal from '../../component/api/Modal';


function User() {
    const { usernick } = useParams();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState([]); // 사용자 목록
    const [currentList, setCurrentList] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    const [bookmarkSlidesData, setBookmarkSlides] = useState([]);
    const [profileSlidesData, setProfileSlides] = useState([]);
    // 글, 댓글 불러올거
    const [tagName, setTagName] = useState("Tag1");
    const [list, setList] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [profileImageSrc, setProfileImageSrc] = useState('');

    useEffect(() => {   // 제일 처음 사용자 이미지 값 불러오기
        if (!usernick) {
            navigate('/');
            return; // 추가적으로 return을 해줘야 후속 코드를 방지할 수 있음
        }
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:9988/user/info/${usernick}`);
                const userInfo = response.data;
                console.log(response.data.user);
                console.log(response.data.bookmarks);
                console.log(response.data.followers);
                setUserInfo(response.data.user);
                setBookmarkSlides(response.data.bookmarks);
                setProfileSlides(response.data.followers);

        } catch (error) {
            if (error.response.data.error == "User not found" && error.response.status === 404) {
                // usernick이 없을 때 홈으로 리다이렉트
                window.location = "/";
            } else {
                // 다른 에러 처리
            }
        }
    };

    fetchUserInfo();
    }, [usernick, navigate]);




    // 데이터를 초기화하는 useEffect 추가
    useEffect(() => {
        // 초기 데이터 설정
        // setBookmarkSlides(bookmarkSlides);
        // setProfileSlides(useprofileSlides);
    }, []);
    while (bookmarkSlidesData.length < 5 && bookmarkSlidesData.length != 0){
        bookmarkSlidesData.push({ imgSrc: "empty", className: "empty-slide"});
    }
    // while (profileSlidesData.length < 7) {
    //     profileSlidesData.push({ imgSrc: "empty", usernick: "", className: "empty-slide" , userid : ""}); // 빈 슬라이드 추가
    // }

    const fetchUserList = async (type) => {
        try {
            const endpoint = type === 'following' ? 'following' : 'followers';
            const response = await axios.get(`http://localhost:9988/user/info/f/${endpoint}`, {
            //const response = await axios.get("http://localhost:9988/user/info/f/follow", {
            params: { usernick:usernick } // params를 사용하여 쿼리 파라미터로 전달
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
    useEffect(() => {
        // 초기 데이터 설정
        console.log("변경" + userList.data)
    }, [userList]);

    const handleOpenModal = (type) => {
        fetchUserList(type);
        setIsModalOpen(true);
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
    

    // 개인 채팅방 생성 코드
      async function createSoloRoom(){
        alert("hi");
        const formData = {
            'chat_title': '고구마1234',//데이터 안씀  그냥넣는 값
            'chatlist_type': 2,
            'user2': 'flower1234', // 상대 유저 아이디 이게 중요
            'chatlist_img': '1' //데이터 안씀 그냥넣는 값
        }
        const {data} = await axios.post("http://localhost:9988/chat/create", formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          openWindow(data)
    }
    function openWindow(url){
        const popupWindow = window.open(
            'http://localhost:3000/chatting/'+url, // 열고자 하는 URL
            '_blank', // 새 창으로 열기
            'width=500,height=800' // 팝업 창의 크기
          );
          popupWindow.focus();
    }


    return (
        <div className="User">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "info">
                     <div id = "info_change">
                        
                    </div>
                    <div id = "profile">
                        <img src = {userInfo.userprofile} alt = {profile}/>
                        <span>{userInfo.usernick}님</span>
                    </div>
                    <div className = "followingBtn">
                        <button className="btn btn-secondary">팔로우</button>
                        <button className="btn btn-secondary" onClick={createSoloRoom} style ={{marginLeft : "10px"}}>채팅하기</button>
                    </div>
                    <div id = "userinfo">
                        <div onClick={() => handleOpenModal('following')}>
                            팔로잉 : <span>{userInfo.follower}</span>
                        </div>
                        <div onClick={() => handleOpenModal('followers')}>
                            팔로워 : <span>{userInfo.following}</span>
                        </div>
                        <div>게시글 : <span>{userInfo.community}</span></div>
                        <div>댓글 : <span>{userInfo.comment}</span></div>
                    </div>
                </div>
                <div className = "otherinfo">
                    {/* 즐겨찾기 */}
                    <div className = "bookmark">
                        <div className = "content_title">
                            <span>즐겨찾기</span>
                            {/* <Link to="/mypage/bookmarked"> 더보기 {'>'}</Link> */}
                        </div>
                        <div className="content_info">
                            {bookmarkSlidesData.length > 0 ?( 
                                <Slider {...SliderSettings}>
                                    {bookmarkSlidesData.map((slide, index) => (
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
                                    <p>즐겨찾기 목록이가 없습니다</p>
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>
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
                    <div className="noslide" style = {{height : "300px", marginTop : '20px'}}>
                        <BsExclamationCircle />
                        <p>{modalTitle}이 없습니다.</p>
                    </div>
                )}
            </Modal>
            )}    
            </div>
        </div>

    );
}
export default User;