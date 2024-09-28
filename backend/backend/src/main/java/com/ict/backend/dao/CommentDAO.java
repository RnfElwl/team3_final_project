package com.ict.backend.dao;

import com.ict.backend.vo.CommentVO;

import java.util.List;

public interface CommentDAO {

    // 댓글 작성
    void addComment(CommentVO comment);

    // 특정 게시글의 댓글 조회
    List<CommentVO> getComments(int community_no);

    // 댓글 수정
    void updateComment(CommentVO comment);

    // 댓글 삭제
    void deleteComment(int comment_no);
}
