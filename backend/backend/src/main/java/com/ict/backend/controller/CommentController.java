package com.ict.backend.controller;

import com.ict.backend.service.CommentService;
import com.ict.backend.vo.CommentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        // 현재 로그인된 사용자 정보 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증된 사용자가 없거나 인증되지 않은 경우 예외 처리
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("등록된 사용자가 없습니다.");
        }

        // 로그인된 사용자의 userid 가져오기
        String userid = authentication.getName();
        System.out.println("Logged-in user: " + userid); // 디버깅용 로그

        // CommentVO에 로그인된 사용자 ID 설정
        comment.setUserid(userid);

        // 댓글을 서비스에 전달하여 저장
        service.addComment(comment);

        // 저장된 댓글 반환
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
