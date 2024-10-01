import "../../css/community/communityView.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useNavigate, Link } from 'react-router-dom';

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

    // 좋아요 처리
    const handleLike = () => {
        const likeData = {
            community_no: parseInt(community_no),
            userid: "test1234" // 현재 로그인된 사용자 ID
        };

        axios.post(`http://localhost:9988/community/like`, likeData)
            .then(() => {
                setLiked(!liked);
                setLikesCount(liked ? likesCount - 1 : likesCount + 1); // 좋아요 수 업데이트
            })
            .catch(error => {
                console.error("Error liking community:", error);
            });
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
        // 게시글 데이터 가져오기
        axios.get(`http://localhost:9988/community/view/${community_no}`)
            .then(response => {
                console.log(response.data); // API 응답 로그
                setCommunity(response.data); // community 상태 업데이트
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

    // 데이터를 성공적으로 받아온 후에만 렌더링
    if (!community) {
        return <div>Loading...</div>; // 데이터가 없을 때 로딩 표시
    }

    return(
        <div className="community_view">
            <div className="container">
                <div className="view_top">
                    <img className="writer_image" src={community.writerImage} alt="Writer" />
                    <div className="writer_info">
                        <div className="name_location">
                            <p className="writer_name">{community.userid}</p>
                            <p className="location">{community.loc}</p>
                        </div>
                        <p className="writedate">{community.community_writedate}</p>
                    </div>
                    <input type="button" value="팔로우" className="action_button" />
                    <input type="button" value="신고" className="action_button" />
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
                    <h3 className="community_content">{community.community_content}</h3>
                </div>

                <div className="view_bottom">
                    <i 
                        className={`like-icon ${liked ? 'filled' : 'empty'}`} 
                        onClick={handleLike}
                        style={{ fontStyle: 'normal', cursor: 'pointer' }}
                    >
                        {liked ? '♥' : '♡'} {/* 채워진 하트 또는 빈 하트 */}
                    </i>
                    <span className="likeCount">{likesCount}</span>
                    <i className="comment-icon" data-no={`${community.community_no}`} style={{ fontStyle: 'normal' }}> 💬</i>
                    <span className="commentCount">{commentCount}</span>
                    <i className="bookmark-icon" data-no={`${community.community_no}`} style={{ fontStyle: 'normal' }}> 🔖</i>

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