package com.ict.backend.controller;

import com.ict.backend.service.CommentReplyService;
import com.ict.backend.vo.CommentReplyVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/comments/reply")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 포트를 명시
public class CommentReplyController {

    @Autowired
    CommentReplyService service;

    // 대댓글 작성 API
    @PostMapping
    public CommentReplyVO saveReply(@RequestBody CommentReplyVO reply) {
        System.out.println(reply);
        service.saveReply(reply);
        return reply;
    }

    // 대댓글 목록 조회 API
    @GetMapping("/{comment_no}")
    public List<CommentReplyVO> getReplies(@PathVariable int comment_no) {
        return service.getReplies(comment_no);
    }

    // 대댓글 수정 API
    @PutMapping("/{reply_no}")
    public void updateReply(@PathVariable int reply_no, @RequestBody CommentReplyVO reply) {
        reply.setReply_no(reply_no);
        service.updateReply(reply);
    }

    // 대댓글 삭제 API
    @DeleteMapping("/{reply_no}")
    public void deleteReply(@PathVariable int reply_no) {
        service.deleteReply(reply_no);
    }
}
