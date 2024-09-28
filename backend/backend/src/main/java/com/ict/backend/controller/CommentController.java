package com.ict.backend.controller;

import com.ict.backend.service.CommentService;
import com.ict.backend.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/comments")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 포트를 명시
public class CommentController {

    @Autowired
    CommentService service;

    // 댓글 작성
    @PostMapping
    public CommentVO addComment(@RequestBody CommentVO comment) {
        service.addComment(comment);
        return comment;
    }

    // 특정 게시글의 댓글 조회
    @GetMapping("/{community_no}")
    public List<CommentVO> getComments(@PathVariable int community_no) {
        return service.getComments(community_no);
    }

    // 댓글 수정
    @PutMapping("/{comment_no}")
    public void updateComment(@PathVariable int comment_no, @RequestBody CommentVO comment) {
        comment.setComment_no(comment_no);
        service.updateComment(comment);
    }

    // 댓글 삭제
    @DeleteMapping("/{comment_no}")
    public void deleteComment(@PathVariable int comment_no) {
        service.deleteComment(comment_no);
    }
}
