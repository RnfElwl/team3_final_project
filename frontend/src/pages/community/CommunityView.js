import "../../css/community/communityView.css";
import React, { useState, useEffect, useRef } from 'react';
// import axios from "axios";
import axios from '../../component/api/axiosApi';
import { useParams, useNavigate, Link} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import ReportModal from '../../component/api/ReportModal.js';
import { AiOutlineAlert } from "react-icons/ai";


function CommunityView(){
    const { community_no } = useParams(); // URL에서 community_no 가져오기
    const [community, setCommunity] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 상태 추가
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태 추가
    const [replyComment, setReplyComment] = useState({}); // 대댓글 입력 상태
    const [replies, setReplies] = useState({}); // 각 댓글별 대댓글 목록
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [likesCount, setLikesCount] = useState(0); // 좋아요 수
    const [userid, setUserId] = useState('');
    const userprofile = localStorage.getItem('userprofile');
    //const userid = localStorage.getItem('userid');

    const isInitialRender = useRef(true); //1번만 호출 
    const replyShowRender = useRef([]);
    const commentInput = useRef([]);
    const [x, setX] = useState(-1);
    const [y, setY] = useState(-1);
    const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
    const [report, setReport] = useState({});//신고 폼에 있는 값들어있음
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isUserFetched, setIsUserFetched] = useState(false);

    const [userData, setUserData] = useState({});
    const [myid, setMyid] = useState("");
    const [toggle, setToggle] = useState(1);
    const [showReplies, setShowReplies] = useState({}); // 각 댓글에 대한 대댓글 표시 여부 관리
    const [replyText, setReplyText] = useState("");



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

    // 게시글 삭제
    const handleDelete = () => {
        if (window.confirm("정말로 게시글을 삭제하시겠습니까?")) {
            axios.delete(`http://localhost:9988/community/${community_no}`)
                .then(() => {
                    alert("게시글이 삭제되었습니다.");
                    navigate("/community"); // 삭제 후 리스트 페이지로 이동
                })
                .catch(error => {
                    console.error("게시글 삭제 중 오류가 발생했습니다.", error);
                });
        }
    };

    // 게시글 수정
    const handleEdit = () => {
        navigate(`/community/CommunityEdit/${community_no}`); // 수정 페이지로 이동
    };

    useEffect(() => {
        // 페이지가 처음 로드될 때만 실행되도록 조건 설정
        if (isInitialRender.current) {
            isInitialRender.current = false; // 첫 번째 렌더링 이후로는 실행 안되도록 설정
            // 게시글 데이터 가져오기
            axios.get(`http://localhost:9988/community/view/${community_no}`)
                .then(response => {
                    console.log(response.data); // API 응답 로그
                    setCommunity(response.data); // community 상태 업데이트
                    setLikesCount(response.data.community_like); // 초기 좋아요 수 설정
                    setLiked(response.data.like_state==1?true:false);
                    //setLiked(response.data.liked);  //초기 좋아요 상태 설정
                    //setHitCount(response.data.hitCount);        조회수 설정
                })
                .catch(error => {
                    console.error("Error fetching community view:", error);
                });
            // 댓글 데이터 가져오기
            axios.get(`http://localhost:9988/community/comments/${community_no}`)
                .then(response => {
                    setComments(response.data); // 댓글 상태 업데이트
                })
                .catch(error => {
                    console.error("Error fetching comments:", error);
                });    
            // 조회수 증가 로직
            const increaseHitCount = async () => {
                try {
                    await axios.put(`http://localhost:9988/community/hit/${community_no}`); // 조회수 증가 API 호출
                    console.log("조회수 증가 완료");
                } catch (error) {
                    console.error("Error increasing hit count:", error);
                }
            };

            // 조회수 증가는 페이지가 처음 로드될 때 한 번만 실행
            increaseHitCount();
        }
    }, [community_no]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value); // 입력값 상태 업데이트
    };

    async function getUser() {
        try {
            const result = await axios.get('http://localhost:9988/user/userinfo');
            setMyid(result.data); // 사용자 ID 설정
            const params = { userid: result.data };
            const result2 = await axios.get('http://localhost:9988/getUserData', { params });
            setUserData(result2.data); // 사용자 데이터 설정
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }    

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        
        // 사용자 정보를 가져오는 함수를 호출합니다.
        await getUser();
    
        // myid가 설정되었는지 확인
        if (!myid) {
            console.error("User is not logged in or myid is missing");
            return; // userid가 없으면 제출 방지
        }
    
        if (newComment.trim()) {
            // 새로운 댓글 추가 로직
            const commentData = {
                userid: myid, // 사용자 ID 사용
                usernick: userData.usernick,
                community_no: parseInt(community_no),
                comment_content: newComment,
                writerImage : userData.image_url,
                // 추가 필드가 필요할 경우 여기에 추가
            };
    
            try {
                const response = await axios.post(`http://localhost:9988/community/comments`, commentData);
                setComments([...comments, response.data]); // 댓글 상태 업데이트
                setNewComment(""); // 입력 필드 초기화
            } catch (error) {
                console.error("Error submitting comment:", error);
            }
        }
    };
    
    useEffect(() => {
        getUser(); // 컴포넌트가 마운트될 때 사용자 정보를 가져옴
    }, []);

    // 댓글 수 계산
    const commentCount = comments.length;
     function handleReplyUpdate(reply){
        const updatedCommentContent = prompt("댓글을 수정하세요:", reply.reply_content);
        if (updatedCommentContent !== null) {
            const updatedComment = {
                ...reply,
                reply_content: updatedCommentContent
            };
            console.log(updatedComment);
            axios.put(`http://localhost:9988/community/comments/reply/${reply.reply_no}`, updatedComment)
                .then(() => {
                    // setComments(comments.map(c => c.comment_no === comment.comment_no ? updatedComment : c)); // 댓글 상태 업데이트
                    toggleReplies(reply.comment_no)
                    
                })
                .catch(error => {   
                    console.error("Error updating comment:", error);
                });
        }
    }
    function handleReplyDelete(reply){
        if(window.confirm("이 댓글을 삭제하시겠습니까?")) {
            // 댓글 삭제 로직
            axios.delete(`http://localhost:9988/community/comments/reply/${reply.reply_no}`)
                .then(() => {
                    toggleReplies(reply.comment_no);
                })
                .catch(error => {
                    console.error("Error deleting comment:", error);
                });
        }
    }
    const handleCommentUpdate = (comment) => {
        // 댓글 수정 로직
        const updatedCommentContent = prompt("댓글을 수정하세요:", comment.comment_content);
        if (updatedCommentContent !== null) {
            const updatedComment = {
                ...comment,
                comment_content: updatedCommentContent
            };

            axios.put(`http://localhost:9988/community/comments/${comment.comment_no}`, updatedComment)
                .then(() => {
                    setComments(comments.map(c => c.comment_no === comment.comment_no ? updatedComment : c)); // 댓글 상태 업데이트
                })
                .catch(error => {
                    console.error("Error updating comment:", error);
                });
        }
    };

    const handleCommentDelete = (comment_no) => {
        // 삭제 확인 다이얼로그
        if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
            // 댓글 삭제 로직
            axios.delete(`http://localhost:9988/community/comments/${comment_no}`)
                .then(() => {
                    setComments(comments.filter(comment => comment.comment_no !== comment_no)); // 댓글 상태 업데이트
                })
                .catch(error => {
                    console.error("Error deleting comment:", error);
                });
        }
    };

    // // 댓글에 좋아요 처리
    // const handleLikeComment = (comment_no) => {
    //     axios.post(`http://localhost:9988/community/comments/like/${comment_no}`)
    //         .then(() => {
    //             setLikes({ ...likes, [comment_no]: likes[comment_no] + 1 });
    //         })
    //         .catch(error => {
    //             console.error("Error liking comment:", error);
    //         });
    // };

    // useEffect(() => {

    //     // 댓글별 대댓글 가져오기
    //     comments.forEach(comment => {
    //         axios.get(`http://localhost:9988/community/comments/reply/${comment.comment_no}`)
    //             .then(response => {
    //                 setReplies(prevReplies => ({
    //                     ...prevReplies,
    //                     [comment.comment_no]: response.data
    //                 }));
    //             })
    //             .catch(error => {
    //                 console.error(`Error fetching replies for comment ${comment.comment_no}:`, error);    
    //             });
    //     });
    // }, [comments]);

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const toggleReplies = async (comment_no) => {
        const {data} = await  axios.get(`http://localhost:9988/community/comments/reply/${comment_no}`);
        setReplyComment((p)=>({...p, [comment_no]:data}));
    };
    const handleReplySubmit = (comment_no, i) => {
        if(replyText==""){
            return;
        }
        commentInput.current[x][y].style.display = "none"; 
        const before = replyComment;
        const replyData = {
            comment_no: comment_no,
            reply_content: replyText,
        };
        axios.post(`http://localhost:9988/community/comments/reply`, replyData)
            .then(response => {
                // setReplyComment((p)=>({ ...p,
                //      [comment_no]: [...(p[comment_no] || []), response.data]})    );
                toggleReplies(comment_no)
                setReplyText("");
                removeShowBtn(i);
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    if (error.response.data === "Need login") {
                        // 로그인 필요 시 로그인 페이지로 리디렉션
                        alert("답글 기능은 로그인이 필요합니다.");
                        navigate("/signin"); // 로그인 페이지 경로
                    } else {
                        // 400 오류가 발생하면 상태 복구
                        setReplyComment(before);
                        alert("답글 상태를 업데이트하는 데 실패했습니다."); // 실패 메시지
                    }
                } else {
                    // 다른 에러 처리 (네트워크 오류 등)
                    console.error('Error toggling follow status:', error);
                    setReplyComment(before);
                    alert("답글 상태를 업데이트하는 중 에러가 발생했습니다."); // 에러 메시지
                }
            });
    };
    async function handleToReplySubmit(reply){
        if(replyText==""){
            return;
        }
        
        console.log(reply);
        console.log(replyText);
        const replyData = {
            comment_no: reply.comment_no,
            reply_content: replyText,
            tag_usernick: reply.usernick
        };
        const {data} = await axios.post(`http://localhost:9988/community/comments/reply`, replyData);
        setReplyComment((p)=>({ ...p,
            [reply.comment_no]: [...(p[reply.comment_no] || []), data]}));
        toggleReplies(reply.comment_no);
        commentInput.current[x][y].style.display = 'none';
    }

    function openReport(e){{/* 신고 기능 */}
        const id = e.target.dataset.id;
        const userid = e.target.dataset.userid;
        const content = e.target.dataset.content;
        setReport({
            report_tblname: 2, // 본인 테이블에 따라 다름
            report_tblno:  id, // 이건 uuid값이 아니라 id로 수정해야함
            reported_userid: userid, // 피신고자id
            report_content: content,// 피신고자의 채팅 내용
        })
        toggleReport();
    }

    // 모달창 열고 닫기 함수
    const toggleReport = () => {
        setReportShow(!reportShow);
    };
    
    useEffect(() => {
        if (!isUserFetched) { // 사용자가 이미 불러와지지 않았다면
            axios.get(`http://localhost:9988/user/userinfo`)
                .then((response) => {
                    const userid = response.data; // 응답 구조에 맞게 수정
                    setLoggedInUserId(userid);
                    setIsUserFetched(true); // 사용자 정보 불러오기 완료
                })
                .catch((error) => {
                    console.error("Error fetching user info:", error);
                });
        }
    }, [isUserFetched]); // isUserFetched가 변경될 때마다 호출
   
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
    function showCommentInput(i, j){
        if(j!=0 && y==0){
            commentInput.current[x][0].style.display = 'none';
        }
        if(i==x && j==y){
            if(commentInput.current[x][y].style.display=='block'){
                commentInput.current[x][y].style.display = 'none';
            }
            else{
                commentInput.current[x][y].style.display = 'block';
            }
        }
        else{
            commentInput.current[i][j].style.display = 'block';
        }
        setX(i);
        setY(j);
    }
    
    function toggleFollow(user){
        console.log(user);
        axios.post('http://localhost:9988/user/info/toggleFollow', {
            follow_user_nick: user.usernick,
            newStatus: user.follow === 1 ? "0" : "1"
        })
        .then(response => {
            console.log(response.data); // 성공 응답 처리
            setCommunity((p)=>({...p, follow: user.follow=== 1 ? "0" : "1"}));
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                if (error.response.data === "Need login") {
                    // 로그인 필요 시 로그인 페이지로 리디렉션
                    alert("팔로우 기능은 로그인이 필요합니다.");
                    navigate("/signin"); // 로그인 페이지 경로
                } else {
                    // 400 오류가 발생하면 상태 복구
                    setCommunity((p)=>({...p, follow: user.follow=== 1 ? "0" : "1"}));
                    alert("팔로우 상태를 업데이트하는 데 실패했습니다."); // 실패 메시지
                }
            } else {
                // 다른 에러 처리 (네트워크 오류 등)
                console.error('Error toggling follow status:', error);
                setCommunity((p)=>({...p, follow: user.follow=== 1 ? "0" : "1"}));
                alert("팔로우 상태를 업데이트하는 중 에러가 발생했습니다."); // 에러 메시지
            }
        });

    }
    function removeShowBtn(index){
        const element = replyShowRender.current[index]; // 클릭된 항목 참조
    if (element) {
      element.style.display = 'none'; // DOM 조작으로 항목 숨기기
    }
    }
    // 데이터를 성공적으로 받아온 후에만 렌더링
    if (!community) {
        return <div>Loading...</div>; // 데이터가 없을 때 로딩 표시
    }

    return(
        <div className="community_view">
            <div className="container">
                <div className="view_top">
                    {myid==community.userid?
                    <Link to={`/mypage`}>
                        <img className="writer_image" src={`http://localhost:9988/${community.userprofile}`} alt="Writer" />
                    </Link>:<Link to={`/user/info/${community.usernick}`}>
                        <img className="writer_image" src={`http://localhost:9988/${community.userprofile}`} alt="Writer" />
                    </Link>}
                    
                    <div className="writer_info">
                        <p className="writer_name">{community.userid}</p>
                        <div className="list_info">
                            <p className="writedate">{formatDate(community.community_writedate)}</p>
                            {community.loc && community.loc.trim() !== "" && community.loc !== "null" ? (
                                <>
                                    <span className="separator">·</span>
                                    <p className="location">{community.loc}</p>
                                </>
                            ) : null}
                        </div>
                    </div>
                     
                    <div className="action_button_container">
                        {loggedInUserId !== null && loggedInUserId !== community.userid && (
                            <>
                                <input type="button" 
                                value={community.follow==1?'following':'follow'}
                                 className="action_button" 
                                 onClick={()=>{toggleFollow(community)}}  
                                 />
                                <button 
                                    className="report_button" 
                                    title="신고"
                                    onClick={(e) => openReport(e)} 
                                    data-id={community.community_no}
                                    data-userid={community.userid}
                                    data-content={community.community_title}
                                >
                                    <AiOutlineAlert style={{ fontSize: '20px', color: '#f44336' }} />
                                </button>
                            </>
                        )}
                    </div>
                
                    <ReportModal    
                        reportShow={reportShow}// 모달창 보이기 여부
                        toggleReport={toggleReport} // 모달창 열고닫기 함수
                        report={report}// 신고 데이터 변수
                        setReport={setReport} // 신고 데이터 변수 세팅
                    />
                </div> 
                <hr/>

                <div className="view_middle">
                    <div className="category_title">
                        <div className="category">{getCategoryName(community.category)}</div>
                        <h3 className="community_title">{community.community_title}</h3>
                    </div>
                    {community.community_img && (
                        <img className="community_img" src={community.community_img} alt="Uploaded" />
                    )}
                    <h3 className="community_content" dangerouslySetInnerHTML={{ __html: community.community_content }}></h3>
                </div>

                <div className="view_bottom">
                        <i className="far fa-eye"></i>  {/* 조회수 아이콘 (눈 모양) */}
                        <span className="hitCount">{community.hit}</span>  {/* 조회수 */}
                        <i className="far fa-comment"></i>
                        <span className="commentCount">{commentCount}</span>
                        <i 
                            className={`fa-heart ${liked ? 'fas' : 'far'}`}  // fas는 채워진 하트, far는 빈 하트
                            onClick={handleLikeToggle}
                            style={{ 
                                color: liked ? 'red' : 'white',  // 좋아요 상태에 따라 하트 색상 변경
                                cursor: 'pointer' 
                            }}
                        ></i>
                        <span className="likeCount">{likesCount}</span>

                    <div className="edit_delete">
                        {loggedInUserId !== null && loggedInUserId == community.userid && (
                            <>
                                <input type="button" value="수정" className="edit_button" onClick={handleEdit}/>
                                <input type="button" value="삭제" className="delete_button" onClick={handleDelete}/>
                            </>
                        )}
                    </div> 
                </div>  

                <div className="comments_section">
                    {loggedInUserId !== null && (
                        <>
                            {/* <h3>댓글 ({commentCount})</h3> */}
                            <form onSubmit={handleCommentSubmit} className="comment_form">
                                <input
                                    className="inputform"
                                    type="text"
                                    value={newComment}
                                    onChange={handleCommentChange}
                                    placeholder="댓글을 입력하세요"
                                />
                                <button type="submit" className="submit_button">댓글 남기기</button>
                            </form>
                        </>
                    )}

                    <div className="comments_list">
                        {comments.map((comment, i) => (
                            <div key={comment.comment_no} className="comment_container">
                                <div className="comment_item">
                                    <div className="comment_top">
                                        <div className="comment_user">
                                            {myid==comment.userid?
                                             <Link to="/mypage">
                                             <img className="comment_writer_image" src={`http://localhost:9988/${comment.writerImage}`} alt="작성자" />
                                             </Link>:
                                            <Link to={`/user/info/${comment.usernick}`}>
                                            <img className="comment_writer_image" src={`http://localhost:9988/${comment.writerImage}`} alt="작성자" />
                                            </Link>
                                        }
                                           
                                            <p className="comment_writer_name">{comment.usernick}</p>
                                        </div>
                                        <div className="comment_actions"> 
                                            <p className="comment_writedate">{comment.comment_writedate}</p>
                                            {
                                                myid===comment.userid&&(
                                                    <>
                                                    <button onClick={() => handleCommentUpdate(comment)}>Edit</button>
                                                    <button onClick={() => handleCommentDelete(comment.comment_no)}>Del</button>
                                                    </>
                                                )
                                            }
                                                {/* <button onClick={() => handleLikeComment(comment.comment_no)}>좋아요 {likes[comment.comment_no]}</button> */}
                                            </div>
                                        </div>
                                    <div className="comment_content">{comment.comment_content}</div>
                                    <div className="comment_info">
                                        <button onClick={()=>showCommentInput(i, 0)} className="recomment">답글</button>
                                        {
                                            comment.reply_cnt!=0&&(
                                                <button  className="reply_open" onClick={() => {toggleReplies(comment.comment_no); removeShowBtn(i)}} 
                                                ref={(el) => (replyShowRender.current[i] = el)}
                                                >
                                            댓글 보기
                                        </button>
                                            )
                                        }
                                        </div>
                                    <form className="comment_input" onSubmit={(e) =>{ 
                                        e.preventDefault();
                                        handleReplySubmit(comment.comment_no, i)}} ref={(el) => { if (!commentInput.current[i]) {
                                                commentInput.current[i] = [];

                                            }
                                            commentInput.current[i][0] = el;
                                            } }>
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={handleReplyChange}
                                                placeholder="대댓글을 입력하세요"
                                            />
                                            <button type="submit">답글 남기기</button>
                                    </form>
                                    {/* 대댓글 리스트 표시 */}
                                    {replyComment[comment.comment_no] && (
                                        <div className="replies">
                                            {replyComment[comment.comment_no].map((reply, j) => (
                                                <>
                                                <div  className="reply_item">
                                                    <div className="comment_top">
                                                        <div className="comment_user">
                                                        {myid==reply.userid?
                                             <Link to="/mypage">
                                             <img className="comment_writer_image" src={`http://localhost:9988/${reply.writerImage}`} alt="작성자" />
                                             </Link>:
                                            <Link to={`/user/info/${comment.usernick}`}>
                                            <img className="comment_writer_image" src={`http://localhost:9988/${reply.writerImage}`} alt="작성자" />
                                            </Link>
                                        }
                                                            <p className="comment_writer_name">{reply.usernick}</p>
                                                        </div>
                                                        <div className="comment_actions"> 
                                                            <p className="comment_writedate">{reply.reply_writedate}</p>
                                                            {
                                                                myid===reply.userid&&(
                                                                    <>
                                                                    <button onClick={() => handleReplyUpdate(reply)}>Edit</button>
                                                                    <button onClick={() => handleReplyDelete(reply)}>Del</button>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="comment_content"><span className="tag">{reply.tag_usernick!=null?`@${reply.tag_usernick}`:""}</span>{reply.reply_content}</div>
                                                        <div className="comment_info">
                                                        <div onClick={()=>showCommentInput(i, j+1)}>답글</div>
                                                        </div>
                                                </div>
                                                <form className="comment_input" onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleToReplySubmit(reply)}} ref={(el) => (commentInput.current[i][j+1] = el)}>
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={handleReplyChange}
                                                        placeholder="대댓글을 입력하세요"
                                                    />
                                                    <button type="submit">답글 남기기</button>
                                                </form>


                                            </>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>       
            </div>    
        </div>
    );
}
export default CommunityView;