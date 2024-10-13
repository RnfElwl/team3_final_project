import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import {useParams } from 'react-router-dom';
import axios from '../../component/api/axiosApi';
import { faPen, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import { SliderSettings, AdaptiveHeightSettings } from '../../component/api/SliderSetting';
import { recentSlides, bookmarkSlides, useprofileSlides  } from '../../component/api/SliderSetting';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import '../../css/mypage/User.css';
import profile from '../../img/profile.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function User() {
    const { usernick } = useParams();
    const navigate = useNavigate();

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
        setBookmarkSlides(bookmarkSlides);
        setProfileSlides(useprofileSlides);
    }, []);
    while (bookmarkSlidesData.length < 5 && bookmarkSlidesData.length != 0){
        bookmarkSlidesData.push({ imgSrc: "empty", className: "empty-slide"});
    }
    while (profileSlidesData.length < 7) {
        profileSlidesData.push({ imgSrc: "empty", usernick: "", className: "empty-slide" , userid : ""}); // 빈 슬라이드 추가
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


    return (
        <div className="User">
            <div className="container">
                {/* 사용자 정보 세션 */}
                <div className = "info">
                     <div id = "info_change">
                        <button className="btn btn-secondary" onClick={() => navigate('/mypage/edit')}><FontAwesomeIcon icon={faPenToSquare} />채팅하기</button>
                    </div>
                    <div id = "profile">
                        <img src = {userInfo.userprofile} alt = {profile}/>
                        <span>{userInfo.usernick}님</span>
                    </div>
                    <div className = "followingBtn">
                        <button className="btn btn-secondary">팔로우</button>
                    </div>
                    <div id = "userinfo">
                        <div>팔로잉 : <span>{userInfo.follower}</span></div>
                        <div>팔로워 : <span>{userInfo.following}</span></div>
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
                            <Slider {...SliderSettings}>
                                {bookmarkSlidesData.map((slide, index) => (
                                    <div key={index}>
                                        <a href={`/movies/view/${slide.movie_code}`}>
                                            <img className="slidPoster" src={slide.movie_link} alt={slide.movie_kor || "empty"} />
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
                            {/* <a href = "#"> 더보기 {'>'}</a> */}
                        </div>
                        <div className="content_info">
                            <Slider {...AdaptiveHeightSettings}>
                                {profileSlidesData.map((slide, index) => (
                                    <div key={index}>
                                        <a href={`/user/info/${slide.usernick}`}>
                                            <img className="userprofile" src={slide.image_url || slide.imgSrc} alt="프로필" />
                                            <p className="usernick">{slide.usernick || ""}</p>
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
                            {/* <a href = "#"> 더보기 {'>'}</a> */}
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
                </div>            
            </div>
        </div>

    );
}
export default User;