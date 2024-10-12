import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axios from '../../component/api/axiosApi';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import { SliderSettings, AdaptiveHeightSettings } from '../../component/api/SliderSetting';
import { recentSlides, bookmarkSlides, useprofileSlides  } from '../../component/api/SliderSetting';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../../css/mypage/mypage.css';
import profile from '../../img/profile.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Mypage() {
    const [recentSlidesData, setRecentSlides] = useState([]);
    const [bookmarkSlidesData, setBookmarkSlides] = useState([]);
    const [profileSlidesData, setProfileSlides] = useState([]);
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
    const [profileImageSrc, setProfileImageSrc] = useState('');
    const defaultProfileImage = profile;

    useEffect(() => {   // 제일 처음 사용자 이미지 값 불러오기
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

    fetchUserInfo();
    }, []);

    const handleProfileImageError = () => {
        setProfileImageSrc(defaultProfileImage); // 이미지 로드 실패 시 기본 이미지로 설정
        console.log(profileImageSrc);
    };

    const navigate = useNavigate();

    // 데이터를 초기화하는 useEffect 추가
    useEffect(() => {
        // 초기 데이터 설정
        setRecentSlides(recentSlides);
        setBookmarkSlides(bookmarkSlides);
        setProfileSlides(useprofileSlides);
    }, []);
      while (useprofileSlides.length < 7) {
        useprofileSlides.push({ imgSrc: "empty", nick: "", className: "empty-slide" , userid : ""}); // 빈 슬라이드 추가
      }

      const fetchData = async (tag) => {
        let url;
        if (tag === "Tag1") {
          url = "http://localhost:9988/user/userinfo";  // 글 리스트 호출 URL
        } else if (tag === "Tag2") {
          url = "http://localhost:9988/api/comments";  // 댓글 리스트 호출 URL
        }
    
        try {
          const response = await axios.get(url);
          setList(response.data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
    
      const handleClickedTagName = (tag) => {
        setTagName(tag);
        fetchData(tag);
      };
    
      // 컴포넌트가 처음 렌더링될 때 Tag1 데이터를 자동으로 호출
    //   useEffect(() => {
    //     fetchData("Tag1");
    //   }, []);


    return (
        <div className="myPage">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "info">
                    <div id = "profile">
                        <img src = {profileImageSrc} alt = {profile} onError={handleProfileImageError}/>
                        <span>{userInfo.usernick}님</span>
                    </div>
                    <div id = "userinfo">
                        <p>이름 : <span>{userInfo.username}</span></p>
                        <p>주소 : <span>{userInfo.useraddr} ({userInfo.addrdetail})</span></p>
                        <p>전화번호 : <span>{userInfo.usertel}</span></p>
                        <p>이름 : <span>{userInfo.username}</span></p>
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
                            <Link to="/mypage/recentwatch"> 더보기 {'>'}</Link>
                        </div>
                        <div className = "content_info">
                            <Slider {...SliderSettings}>
                            {recentSlides.map((slide, index) => (
                                <div key={index}>
                                <a href = {`/movies/view/${slide.movieCd}`}>
                                <img className="slidPoster" src={slide.imgSrc} alt={slide.alt} />
                                </a>
                                </div>
                            ))}
                            </Slider>
                        </div>
                    </div>
                    {/* 즐겨찾기 */}
                    <div className = "bookmark">
                        <div className = "content_title">
                            <span>즐겨찾기</span>
                            <Link to="/mypage/bookmarked"> 더보기 {'>'}</Link>
                        </div>
                        <div className = "content_info">
                            <Slider {...SliderSettings}>
                            {bookmarkSlides.map((slide, index) => (
                                <div key={index}>
                                <a href = {`/movies/view/${slide.movieCd}`}>
                                <img className="slidPoster" src={slide.imgSrc} alt={slide.alt} />
                                </a>
                                </div>
                            ))}
                            </Slider>
                        </div>
                    </div>
                    {/* 즐찾 회원 */}
                    <div className = "follower">
                        <div className = "content_title">
                            <span>팔로워</span>
                            <a href = "#"> 더보기 {'>'}</a>
                        </div>
                        <div className = "content_info">
                            <Slider {...AdaptiveHeightSettings}>
                            {useprofileSlides.map((slide, index) => (
                                <div key={index}>
                                <a href = {`/userinfo/${slide.userid}`}>
                                <img className="userprofile" src={slide.imgSrc} alt="프로필" />
                                <p className="usernick">{slide.nick}</p>
                                </a>
                                </div>
                            ))}
                            </Slider>
                        </div>
                    </div>
                    {/* 내가 쓴 글 */}
                    <div className = "write">
                        <div className = "content_title">
                            <span>내가 쓴 글</span>
                            <a href = "#"> 더보기 {'>'}</a>
                        </div>
                        <div className = "content_info">
                            <ul style={{ display: 'inline-block', color : 'white' }}>
                            <button className="btn btn-secondary" style={{ marginRight: '10px' }} onClick={() => handleClickedTagName("Tag1")}>글</button>
                            <button className="btn btn-secondary" style={{ marginLeft: '10px' }} onClick={() => handleClickedTagName("Tag2")}>댓글</button>
                        </ul>
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th className = "col-md-1">번호</th>
                                    <th className = "col-md-2">작성한 곳</th>
                                    <th className = "col-md-6">제목</th>
                                    <th className = "col-md-2">작성일</th>
                                    <th className = "col-md-1"></th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>70</td>
                                    <td>커뮤니티</td>
                                    <td>베테랑 2 재미있음?</td>
                                    <td>2024-09-10</td>
                                    <th>
                                        <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                    </th>
                                </tr>
                                <tr>
                                    <td>71</td>
                                    <td>커뮤니티</td>
                                    <td>탈출 보고옴</td>
                                    <td>2024-09-11</td>
                                    <th>
                                        <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                    </th>
                                </tr>
                                <tr>
                                    <td>72</td>
                                    <td>커뮤니티</td>
                                    <td>안본 흑우</td>
                                    <td>2024-09-13</td>
                                    <th>
                                        <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    {/* Q&A */}
                    <div className = "qna">
                        <div className = "content_title">
                            <span>QnA</span>
                            <a href = "#"> 더보기 {'>'}</a>
                        </div>
                        <div className = "content_info">
                        <table className="table table-dark table-hover">
                            <thead>
                                <tr>
                                    <th className = "col-md-1">번호</th>
                                    <th className = "col-md-2">문의종류</th>
                                    <th className = "col-md-4" >제목</th>
                                    <th className = "col-md-2">상태</th>
                                    <th className = "col-md-2">작성일</th>
                                    <th className = "col-md-1"></th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>3</td>
                                    <td>서버 문의</td>
                                    <td>서버가 느려요</td>
                                    <td>처리 중</td>
                                    <td>2024-09-10</td>
                                    <th>
                                        <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                    </th>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>배송 문의</td>
                                    <td>택배 언제와요</td>
                                    <td>처리 완료</td>
                                    <td>2024-09-08</td>
                                    <th>
                                        <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                    </th>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>서버 문의</td>
                                    <td>얘 비매너에요</td>
                                    <td>처리 중</td>
                                    <td>2024-09-13</td>
                                    <th>
                                        <FontAwesomeIcon icon={faPenToSquare} size ="2x" onClick={() => alert("edit")}/>  <FontAwesomeIcon icon={faTrashCan} size ="2x" onClick={() => alert("delete")}/>
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    {/* 장바구니 */}
                    <div className = "cart">
                        <div className = "content_title">
                            <span>장바구니</span>
                            <a href = "#"> 더보기 {'>'}</a>
                        </div>
                        <div className = "content_info">
                        </div>
                    </div>
                    {/* 배송내역 */}
                    <div className = "delivery">
                        <div className = "content_title">
                            <span>배송내역</span>
                            <a href = "#"> 더보기 {'>'}</a>
                        </div>
                        <div className = "content_info">
                        </div>
                    </div>
                </div>            
            </div>
        </div>

    );
}
export default Mypage;