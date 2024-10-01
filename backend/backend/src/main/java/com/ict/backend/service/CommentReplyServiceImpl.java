package com.ict.backend.service;

import com.ict.backend.dao.CommentReplyDAO;
import com.ict.backend.vo.CommentReplyVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;
@Service
public class CommentReplyServiceImpl implements CommentReplyService{
    @Inject
    CommentReplyDAO dao;

    @Override
    public void saveReply(CommentReplyVO reply) {
        dao.saveReply(reply);
    }

    @Override
    public List<CommentReplyVO> getReplies(int reply_no) {
        return dao.getReplies(reply_no);
    }

    @Override
    public void updateReply(CommentReplyVO reply) {
        dao.updateReply(reply);
    }

    @Override
    public void deleteReply(int reply_no) {
        dao.deleteReply(reply_no);
    }
}
