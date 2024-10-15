import "../../css/community/communityView.css";
import React, { useState, useEffect, useRef } from 'react';
// import axios from "axios";
import axios from '../../component/api/axiosApi';
import { useParams, useNavigate} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import ReportModal from '../../component/api/ReportModal.js';
import { AiOutlineAlert } from "react-icons/ai";


function CommunityView(){
    const { community_no } = useParams(); // URL에서 community_no 가져오기
    // const { comment_no } = useParams();
    const [community, setCommunity] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 상태 추가
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태 추가
    const [replyComment, setReplyComment] = useState({}); // 대댓글 입력 상태
    const [replies, setReplies] = useState({}); // 각 댓글별 대댓글 목록
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false); // 좋아요 상태
    const [likesCount, setLikesCount] = useState(0); // 좋아요 수
    const userid = localStorage.getItem('userid');
    //const [hitCount, setHitCount] = useState(0); // 조회수 상태
    const isInitialRender = useRef(true); //1번만 호출 

    const [reportShow, setReportShow] = useState(false);// 신고창 보여주기 여부
    const [report, setReport] = useState({});//신고 폼에 있는 값들어있음
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [isUserFetched, setIsUserFetched] = useState(false);


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
                    setLikesCount(response.data.likesCount); // 초기 좋아요 수 설정
                    //setLiked(response.data.liked);  초기 좋아요 상태 설정
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

    const handleCommentSubmit = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        if (newComment.trim()) {
            // 새로운 댓글 추가 로직
            const commentData = {
                userid: "test1234",
                community_no: parseInt(community_no),
                comment_content: newComment,
                // 추가 필드가 필요할 경우 여기에 추가
            };

            // 댓글 데이터 가져오기
            axios.post('http://localhost:9988/community/comments', commentData)
                .then(response => {
                    setComments([...comments, response.data]); // 댓글 상태 업데이트
                    setNewComment(""); // 입력 필드 초기화
                })
                .catch(error => {
                    console.error("Error submitting comment:", error);
                });
        }
    };

    // 댓글 수 계산
    const commentCount = comments.length;

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

    useEffect(() => {

        // 댓글별 대댓글 가져오기
        comments.forEach(comment => {
            axios.get(`http://localhost:9988/community/comments/reply/${comment.comment_no}`)
                .then(response => {
                    setReplies(prevReplies => ({
                        ...prevReplies,
                        [comment.comment_no]: response.data
                    }));
                })
                .catch(error => {
                    console.error(`Error fetching replies for comment ${comment.comment_no}:`, error);    
                });
        });
    }, [comments]);

    const handleReplyChange = (comment_no, value) => {
        setReplyComment({ ...replyComment, [comment_no]: value });
    };

    const handleReplySubmit = (e, comment_no) => {
        e.preventDefault();
        const replyData = {
            userid: "test1234",
            community_no: parseInt(community_no),
            parent_comment_no: comment_no,
            comment_content: replyComment[comment_no],
        };

        axios.post(`http://localhost:9988/community/comments/reply`, replyData)
            .then(response => {
                setReplies(prevReplies => ({
                    ...prevReplies,
                    [comment_no]: [...(prevReplies[comment_no] || []), response.data]
                }));
                setReplyComment({ ...replyComment, [comment_no]: "" });
            })
            .catch(error => {
                console.error("Error submitting reply:", error);
            });
    };

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

    // 데이터를 성공적으로 받아온 후에만 렌더링
    if (!community) {
        return <div>Loading...</div>; // 데이터가 없을 때 로딩 표시
    }

    return(
        <div className="community_view">
            <div className="container">
                <div className="view_top">
                    <img className="writer_image" src={community.userprofile} alt="Writer" />
                    <div className="writer_info">
                        <p className="writer_name">{community.userid}</p>
                        <div className="list_info">
                            <p className="writedate">{formatDate(community.community_writedate)}</p>
                            {community.loc?.trim() ? (
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
                                <input type="button" value="follow" className="action_button" />
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
                        <input type="button" value="수정" className="edit_button" onClick={handleEdit}/>
                        <input type="button" value="삭제" className="delete_button" onClick={handleDelete}/>
                    </div> 
                </div>  

                

                <div className="comments_section">
                    <h3>댓글 ({commentCount})</h3>
                    <form onSubmit={handleCommentSubmit} className="commnet_form">
                        <input
                            className="inputform"
                            type="text"
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="댓글을 입력하세요"
                        />
                        <button type="submit" className="submit_button">댓글 남기기</button>
                    </form>

                    <div className="comments_list">
                        {comments.map((comment) => (
                            <div key={comment.comment_no} className="comment_item">
                                <div className="comment_top">
                                    <div className="comment_user">
                                        <img className="comment_writer_image" src={community.writerImage} />
                                        <p className="comment_writer_name">{comment.userid}</p>
                                    </div>
                                    <div className="comment_actions">
                                        <p className="comment_writedate">{comment.comment_writedate}</p>
                                        <button onClick={() => handleCommentUpdate(comment)}>수정</button>
                                        <button onClick={() => handleCommentDelete(comment.comment_no)}>삭제</button>
                                        {/* <button onClick={() => handleLikeComment(comment.comment_no)}>좋아요 {likes[comment.comment_no]}</button> */}
                                    </div>
                                </div>
                                <div className="comment_info">
                                    <p className="comment_content">{comment.comment_content}</p>
                                    <form onSubmit={(e) => handleReplySubmit(e, comment.comment_no)}>
                                        <input
                                            type="text"
                                            value={replyComment[comment.comment_no] || ""}
                                            onChange={(e) => handleReplyChange(comment.comment_no, e.target.value)}
                                            placeholder="대댓글을 입력하세요"
                                        />
                                        <button type="submit">대댓글 남기기</button>
                                    </form>
                                </div>
                                {/* 대댓글 리스트 표시 */}
                                {replies[comment.comment_no] && replies[comment.comment_no].map((reply) => (
                                    <div key={reply.comment_no} className="reply_item">
                                        <div className="reply_top">
                                            <p>{reply.userid}</p>
                                            <p>{reply.comment_writedate}</p>
                                        </div>
                                        <p>{reply.comment_content}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>       
            </div>    
        </div>
    );
}
export default CommunityView;