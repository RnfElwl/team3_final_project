import "../../css/community/communityList.css";
import React, { useState, useEffect } from 'react';
// import axios from "axios";
import axios from '../../component/api/axiosApi';
import { useParams, Link } from 'react-router-dom';
// import ReportModal from '../../component/api/ReportModal.js';
import { AiOutlineAlert } from "react-icons/ai";
import CustomImage from "../../component/CustomImage.js";


function CommunityList() {
    const { community_no } = useParams(); // URL에서 community_no 가져오기
    const [community, setCommunity] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [filteredCommunity, setFilteredCommunity] = useState([]); // 필터링된 커뮤니티 상태
    const categories = ["All Posts", "Movies", "Daily", "Free"]; // 카테고리 목록에 "전체" 추가
    const [userid, setUserId] = useState('');
    //const userid = localStorage.getItem('userid');
    const userprofile = localStorage.getItem('userprofile');
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [likesCount, setLikesCount] = useState(0); // 좋아요 수

    const [categoryCounts, setCategoryCounts] = useState({}); // 카테고리별 게시물 수 상태

    //const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
    //const [report, setReport] = useState({});//신고 폼에 있는 값들어있음
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Posts");

    const [communityList, setCommunityList] = useState([]);
    const [sortType, setSortType] = useState("latest");
    const [categoryType, setCategoryType] = useState('All Posts');  // 선택된 카테고리 상태

    // category 값에 따른 카테고리 이름을 반환하는 함수
    const getCategoryName = (category) => {
        switch (category) {
            case 0:
                return "Movies";
            case 1:
                return "Daily";
            case 2:
                return "Free";
            default:
                return "기타";
        }
    };
    
    useEffect(() => {
        communityListSetting(sortType, categoryType);
    }, []);

    function communityListSetting(sortType, categoryType){
        axios.get('http://localhost:9988/community/list', {
            params: { sortType, categoryType } // sortType을 params로 전달
        })
        .then(response => {
                console.log(response.data);
                setCommunityList(response.data);
                
                setCommunity(response.data);
                setFilteredCommunity(response.data);
                
                // 카테고리별 게시물 수 계산
                const counts = response.data.reduce((acc, item) => {
                    const category = getCategoryName(item.category);
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {});

                // 전체 카테고리 수 설정
                counts["All Posts"] = response.data.length;

                setCategoryCounts(counts);

            })
            .catch(error => {
                console.error("Error fetching community list:", error);
            });
    }
    useEffect(() => {
        // 커뮤니티 글 리스트 가져오기
        communityListSetting();

        axios.get('http://localhost:9988/user/userinfo')
            .then(response => {
                setUserId(response.data);
            })
            .catch(error => {
                console.error("데이터 로드 중 오류 발생:", error);
            });
        
            
    }, []);

    useEffect(() => {
        // 게시글 데이터 가져오기
        console.log(community_no)
        axios.get(`http://localhost:9988/community/view/${community_no}`)
            .then(response => {
                console.log(response.data); // API 응답 로그
                console.log(response);
                setCommunity(response.data); // community 상태 업데이트
                setLikesCount(response.data.likesCount); // 초기 좋아요 수 설정
                setLiked(response.data.liked); // 초기 좋아요 상태 설정
            })
            .catch(error => {
                console.error("Error fetching community view:", error);
            }); 
    }, [community_no]);

    useEffect(() => {
        const fetchCommentsCount = async (community_no) => {
            try {
                const response = await axios.get(`http://localhost:9988/community/comments/${community_no}`);
                return response.data.length; // 댓글 수 반환
            } catch (error) {
                console.error(`Error fetching comments count for post ${community_no}:`, error);
                return 0;
            }
        };
    
        const fetchAllCommentsCounts = async () => {
            const counts = await Promise.all(
                community.map(async (communityItem) => {
                    const count = await fetchCommentsCount(communityItem.community_no);
                    return { ...communityItem, commentCount: count };
                })
            );
            setFilteredCommunity(counts); // 댓글 수를 포함한 상태로 업데이트
        };
    
        if (community.length > 0) {
            fetchAllCommentsCounts();
        }
    }, [community]);

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
        setSelectedCategory(category);

        if (category === "All Posts") {
            setFilteredCommunity(communityList); // 카테고리를 선택할 때 상태 업데이트
        } else {
            setFilteredCommunity(communityList.filter(item => getCategoryName(item.category) === category));
        }
    };  

    // 좋아요 처리
    const handleLikeToggle = async (no) => {
        if (!userid) {
            alert('로그인 후 이용가능한 서비스입니다.');
            return; // userid가 없으면 처리 중지
        }

        try {
            
            const isLikedResponse = await axios.get(`http://localhost:9988/community/like/status`, {
                params: { community_no: no, userid }
            });
 
            communityListSetting();
            const likesCountResponse = await axios.get(`http://localhost:9988/community/likes/count/${no}`);
        } catch (error) {
            console.error('좋아요 처리 실패:', error);
        }
        
    };

    // function openReport(id, userid, content){{/* 신고 기능 */}
    //     if(userid){
    //         console.log(id, userid, content);
    //         setReport({
    //             report_tblname: 2, // 본인 테이블에 따라 다름
    //             report_tblno:  id, // 이건 uuid값이 아니라 id로 수정해야함
    //             reported_userid: userid, // 피신고자id
    //             report_content: content,// 피신고자의 채팅 내용
    //         });
    //         toggleReport();
    //     }else{
    //         alert("로그인 후 이용 가능합니다");
    //         window.location.href = "/signin";
    //     }
    // }

    // 모달창 열고 닫기 함수
    // const toggleReport = () => {
    //     if (userid) {
    //         setReportShow(!reportShow);
    //     }else{
    //         alert("로그인 후 이용 가능합니다");
    //         window.location.href = "/signin";
    //     }
    // };

    useEffect(() => {
        axios.get(`http://localhost:9988/user/userinfo`)
            .then((response) => {
                // API의 응답에서 데이터 추출
                const userid = response.data; // userId 값을 변수에 저장
                setLoggedInUserId(userid);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
            });
    }, []);
    
    const formatDate = (dateString) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        
        const date = new Date(dateString); // 날짜 문자열을 Date 객체로 변환
        const day = date.getDate(); // 날짜
        const month = months[date.getMonth()]; // 줄인 월 이름
        const year = date.getFullYear(); // 연도
    
        return `${month} ${day}, ${year}`; // 원하는 형식으로 포맷팅
    };
    function toggleFollow(user){
        axios.post('http://localhost:9988/user/info/toggleFollow', {
            follow_user_nick: user.usernick,
            newStatus: user.follow === 1 ? "0" : "1"
        })
        .then(response => {
            console.log(response.data); // 성공 응답 처리
            communityListSetting();
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                if (error.response.data === "Need login") {
                    // 로그인 필요 시 로그인 페이지로 리디렉션
                    alert("팔로우 기능은 로그인이 필요합니다.");
                    window.location.href = "/signin"; // 로그인 페이지 경로
                } else {
                    // 400 오류가 발생하면 상태 복구
                    const restoredList = filteredCommunity.map((u) => {
                        if (u.userick === user.usernick) {
                            return {
                                ...u,
                                is_follower: u.follow === 1 ? "0" : "1", // 원래 상태로 복구
                            };
                        }
                        return u;
                    });
                    setFilteredCommunity(restoredList);
                    alert("팔로우 상태를 업데이트하는 데 실패했습니다."); // 실패 메시지
                }
            } else {
                // 다른 에러 처리 (네트워크 오류 등)
                console.error('Error toggling follow status:', error);
                const restoredList = filteredCommunity.map((u) => {
                    if (u.usernick === user.usernick) {
                        return {
                            ...u,
                            is_follower: u.follow === 1 ? "0" : "1", // 원래 상태로 복구
                        };
                    }
                    return u;
                });
                setFilteredCommunity(restoredList);
                alert("팔로우 상태를 업데이트하는 중 에러가 발생했습니다."); // 에러 메시지
            }
        });

    }useEffect(() => {
        communityListSetting();
    }, []);

    useEffect(() => {
        setFilteredCommunity(communityList); // communityList가 변경될 때마다 업데이트
    }, [communityList]);

    const sortCommunityList = (type, category) => {
        let filteredList = communityList;

        // 카테고리에 따른 필터링
        if (category && category !== "All Posts") {
            filteredList = communityList.filter(item => getCategoryName(item.category) === category);
        }
        let sortedList = [...filteredList];

        if (type === "latest") {
            sortedList.sort((a, b) => new Date(b.community_writedate) - new Date(a.community_writedate));
        } else if (type === "hit") {
            sortedList.sort((a, b) => b.hit - a.hit);
        } else if (type === "like") {
            sortedList.sort((a, b) => b.community_like - a.community_like);
        }

        setFilteredCommunity(sortedList);
        setSortType(type);
    };

    // 카테고리 선택 시 호출되는 함수
    const handleCategoryChange = (category) => {
        setCategoryType(category);
        sortCommunityList(sortType, category); // 선택된 정렬 상태를 유지한 채로 카테고리 변경
    };

    // 정렬 선택 시 호출되는 함수
    const handleSortChange = (sort) => {
        setSortType(sort);
        sortCommunityList(sort, categoryType); // 선택된 카테고리 상태를 유지한 채로 정렬 변경
    };
        
    return (
        <div className="community_list">
            <div className="container">
                <div className="list_header">
                    <div className="category_box">
                        <ul className="category_list">
                            {categories.map(category => (
                                <li key={category} onClick={() => handleCategoryChange(category)} className={`category_item ${categoryType  === category ? 'active' : ''}`}>
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="search" style={{ position: 'relative', width: '60%' }}>
                        <i className="fas fa-search" style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#ccc',
                            pointerEvents: 'none'
                        }}></i>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            style={{
                                paddingLeft: '40px',  // 아이콘이 겹치지 않도록 여백 추가
                                width: '100%',
                                background: '#1C1C20',
                                color: '#f0f0f0'
                            }}
                        />
                    </div>
                </div>
                <div className="post">
                    <div className="category_counts">
                        {categoryType === "All Posts" ?(
                            <div>
                                {/* 전체 카테고리 수만 표시 */}
                                {categoryCounts["All Posts"] || 0} post
                            </div>
                        ) : (
                            <div>
                                {/* 선택된 카테고리의 게시물 수 */}
                                {categoryCounts[categoryType] || 0} post
                            </div>
                        )}
                    </div>
                    <select onChange={(e) => handleSortChange(e.target.value)} value={sortType}>
                        <option value="latest">최신순</option>
                        <option value="hit">조회순</option>
                        <option value="like">인기순</option>
                    </select>

                    {userid && (
                        <Link to="/community/CommunityWrite">
                            <input className="write" type="button" value="New Post" />
                        </Link>
                    )}
                </div>


                {filteredCommunity.length > 0 ? (
                    filteredCommunity.map((communityItem) => (
                        <div className="list" key={communityItem.community_no}>
                            <Link to={`/community/communityView/${communityItem.community_no}`}>
                                <div className="image_box">
                                    {communityItem.community_img && (
                                        <img className="community_img" src={communityItem.community_img} alt="Uploaded" />
                                    )}
                                </div> 
                            </Link>  
                            <div className="content"> 
                                <div className="list_top">
                                    {userid==communityItem.userid?<Link to="/mypage">
                                        <CustomImage className="writer_image" src={`http://localhost:9988/${communityItem.userprofile}`} alt="Writer" />
                                    </Link>:<Link to={`/user/info/${communityItem.usernick}`}>
                                        <CustomImage className="writer_image" src={`http://localhost:9988/${communityItem.userprofile}`} alt="Writer" />
                                    </Link>}
                                    <div className="writer_info">
                                        <p className="writer_name">{communityItem.usernick}</p>
                                        <div className="list_info">
                                            <p className="writedate">{formatDate(communityItem.community_writedate)}</p>
                                            {/* <p className="location">{communityItem.loc}</p> */}
                                        </div>
                                    </div>
                                    <div className="action_button_container">
                                        {userid !== communityItem.userid && (
                                            <>
                                                <input type="button" value={communityItem.follow==1?'following':'follow'} 
                                                onClick={()=>{toggleFollow(communityItem)}}  
                                                className={`action_button ${communityItem.follow == 1 ? 'following' : 'follow'}`} />
                                                {/* {userid && ( */}
                                                {/* <button 
                                                    className="report_button" 
                                                    title="신고"
                                                    onClick={() => openReport(communityItem.community_no, communityItem.userid, communityItem.community_title)} 
                                                >
                                                    <AiOutlineAlert style={{ fontSize: '20px', color: '#f44336' }} />
                                                </button> */}
                                                {/* )} */}
                                            </>
                                        )}
                                    </div>
                                    {/* <ReportModal    
                                        reportShow={reportShow}// 모달창 보이기 여부
                                        toggleReport={toggleReport} // 모달창 열고닫기 함수
                                        report={report}// 신고 데이터 변수
                                        setReport={setReport} // 신고 데이터 변수 세팅
                                        setDefaultList={()=>{}}
                                    /> */}
                                </div>

                                <Link to={`/community/communityView/${communityItem.community_no}`}>
                                    <div className="list_middle">
                                        <div className="category">{getCategoryName(communityItem.category)}</div>
                                        <h3 className="community_title">{communityItem.community_title}</h3>
                                    </div>
                                </Link>
                                <div className="list_bottom">
                                    <div className="left_info">
                                        <i className="far fa-eye"></i>  {/* 조회수 아이콘 */}
                                        <span className="hitCount">{communityItem.hit}</span>  {/* 조회수 출력 */}
                                        <i className="far fa-comment"></i>
                                        <span className="commentCount">{communityItem.commentCount}</span>
                                    </div>
                                    <div className="right_info">
                                        <i 
                                            className={`fa-heart ${communityItem.like_state==1 ? 'fas' : 'far'}`}  // fas는 채워진 하트, far는 빈 하트
                                            onClick={()=>{handleLikeToggle(communityItem.community_no)}}
                                            style={{ 
                                                color: communityItem.like_state==1 ? 'red' : '#f0f0f0',  // 좋아요 상태에 따라 하트 색상 변경
                                                cursor: 'pointer' 
                                            }}
                                        ></i>
                                        <span className="likeCount">{communityItem.community_like}</span>
                                    </div>
                                </div> 
                            </div>  
                        </div>
                    ))
                ) : (
                    <p style={{textAlign:"center", fontSize:"1.4em", paddingTop:"40px", marginLeft:"20px"}}>No posts have been posted.</p> // 글이 없을 때 메시지
                )}
            </div>

            
        </div>
    );
}

export default CommunityList;
