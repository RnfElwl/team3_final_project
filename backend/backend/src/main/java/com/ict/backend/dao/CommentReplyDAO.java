package com.ict.backend.dao;

import com.ict.backend.vo.CommentReplyVO;

import java.util.List;

public interface CommentReplyDAO {
    boolean saveReply(CommentReplyVO reply);

    List<CommentReplyVO> getReplies(int reply_no);

    void updateReply(CommentReplyVO reply);

    void deleteReply(int reply_no);
}
