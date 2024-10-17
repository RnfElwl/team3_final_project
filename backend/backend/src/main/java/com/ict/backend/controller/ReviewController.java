package com.ict.backend.controller;

import com.ict.backend.service.ReviewService;
import com.ict.backend.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 특정 유저가 영화에 대해 이미 리뷰를 작성했는지 확인
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkUserReview (@RequestParam int movieNo, @RequestParam String userid) {

        boolean reviewExists = reviewService.checkReviewExists(movieNo, userid);
        System.out.println("되는건디 1111");
        return ResponseEntity.ok(reviewExists);
    }





    // 리뷰 추가
    @PostMapping("/add")
    public ResponseEntity<ReviewVO> addReview(@RequestBody ReviewVO reviewVO) {


        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Review received with userid: " + reviewVO.getUserid());
        reviewService.addReview(reviewVO);
        return ResponseEntity.ok(reviewVO);
    }

    // 영화에 대한 리뷰 조회
    @GetMapping("/{movieCode}")
    public ResponseEntity<List<ReviewVO>> getReviewsByMovie(@PathVariable String movieCode) {

        System.out.println("Fetching reviews for movieCode: " + movieCode); // 요청 로그 확인
        List<ReviewVO> reviews = reviewService.getReviewsByMovieCode(movieCode);
        return ResponseEntity.ok(reviews);
    }

    // 리뷰 수정
    @PutMapping("/{movieReviewNo}")
    public ResponseEntity<String> updateReview(@RequestBody ReviewVO updatedReview) {
        String loggedInUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Controller: Calling service to update review with reviewNo: " + updatedReview.toString());
        try {
            reviewService.updateReview(updatedReview); // 서비스 호출
            return ResponseEntity.ok("Review updated successfully");
        } catch(Exception e){
            return ResponseEntity.status(401).body("You are not authorized to edit this review.");
        }

    }

    // 리뷰 삭제
    @DeleteMapping("/{movieReviewNo}")
    public ResponseEntity<String> deleteReview(@PathVariable("movieReviewNo") int movieReviewNo) {

        // 로그인된 사용자 정보 가져오기
        String loggedInUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("있나?: " + movieReviewNo + loggedInUserId );

        try{
            reviewService.deleteReview(movieReviewNo);
            return ResponseEntity.ok("Review deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(401).body("You are not authorized to delete this review.");
        }
    }

}
