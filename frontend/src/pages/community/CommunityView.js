import "../../css/community/communityView.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, Link } from 'react-router-dom';

function CommunityView(){
    const { community_no } = useParams(); // URL에서 community_no 가져오기
    const [community, setCommunity] = useState(null);
    const [comments, setComments] = useState([]); // 댓글 상태 추가
    const [newComment, setNewComment] = useState(""); // 새로운 댓글 입력 상태 추가

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
                        <p className="writer_name">{community.userid}</p>
                        <p className="writedate">{community.community_writedate}</p>
                    </div>
                    <input type="button" value="팔로우" className="action_button" />
                    <input type="button" value="신고" className="action_button" />
                </div> 
                <div className="view_middle">
                    <div className="category">{getCategoryName(community.category)}</div>
                    <h3 className="community_title">{community.community_title}</h3>
                    {community.community_img && (
                        <img className="community_img" src={community.community_img} alt="Uploaded" />
                    )}
                    <h3 className="community_content">{community.community_content}</h3>
                </div>

                <div className="view_bottom">
                    <i className="like-icon" data-no={`${community.community_no}`} style={{ fontStyle: 'normal' }}> ♡</i>
                    <span className="likeCount">{community.likeHit}</span>
                    <i className="comment-icon" data-no={`${community.community_no}`} style={{ fontStyle: 'normal' }}> 💬</i>
                    <span className="commentCount">{community.commentHit}</span>
                    <i className="bookmark-icon" data-no={`${community.community_no}`} style={{ fontStyle: 'normal' }}> 🔖</i>
                </div>   

                <div className="comments_section">
                    <h3>댓글</h3>
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
                        {comments.map((comment, index) => (
                            <div key={index} className="comment_item">
                                <div className="comment_top">
                                    <div className="comment_user">
                                        <img className="comment_writer_image" src={community.writerImage} />
                                        <p className="comment_writer_name">{comment.userid}</p>
                                    </div>
                                    <div className="comment_actions">
                                        <p className="comment_writedate">{comment.comment_writedate}</p>
                                        <button onClick={() => handleCommentUpdate(comment)}>수정</button>
                                        <button onClick={() => handleCommentDelete(comment.comment_no)}>삭제</button>
                                    </div>
                                </div>
                                <div className="comment_info">
                                    <p className="comment_content">{comment.comment_content}</p>
                                    
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