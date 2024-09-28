package com.ict.backend.service;

import com.ict.backend.dao.CommentDAO;
import com.ict.backend.vo.CommentVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Inject
    CommentDAO dao;

    @Override
    public void addComment(CommentVO comment) {
        dao.addComment(comment);
    }

    @Override
    public List<CommentVO> getComments(int community_no) {
        return dao.getComments(community_no);
    }

    @Override
    public void updateComment(CommentVO comment) {
        dao.updateComment(comment);
    }

    @Override
    public void deleteComment(int comment_no) {
        dao.deleteComment(comment_no);
    }
}
