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
    private ReviewService movieReviewService;

    // 리뷰 추가
    @PostMapping("/add")
    public ResponseEntity<ReviewVO> addReview(@RequestBody ReviewVO reviewVO) {


        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Review received with userid: " + reviewVO.getUserid());
        movieReviewService.addReview(reviewVO);
        return ResponseEntity.ok(reviewVO);
    }

    // 영화에 대한 리뷰 조회
    @GetMapping("/{movieCode}")
    public ResponseEntity<List<ReviewVO>> getReviewsByMovie(@PathVariable String movieCode) {

        System.out.println("Fetching reviews for movieCode: " + movieCode); // 요청 로그 확인
        List<ReviewVO> reviews = movieReviewService.getReviewsByMovieCode(movieCode);
        return ResponseEntity.ok(reviews);
    }

    // 리뷰 수정
    @PutMapping("/{movieReviewNo}")
    public ResponseEntity<String> updateReview(@RequestBody ReviewVO updatedReview) {
        String loggedInUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Controller: Calling service to update review with reviewNo: " + updatedReview.toString());

        // 기존 리뷰 가져오기
//        ReviewVO existingReview = movieReviewService.getReviewById(updatedReview.getMovie_review_no());
//        System.out.println("Controller: Fetched existing review: " + existingReview);
//
//        (existingReview != null && existingReview.getUserid().equals(loggedInUserId)) {
//            // 리뷰의 userid를 현재 로그인된 사용자로 설정 (보안 강화)
//            updatedReview.setUserid(loggedInUserId);

        try {
            movieReviewService.updateReview(updatedReview); // 서비스 호출
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
            movieReviewService.deleteReview(movieReviewNo);
            return ResponseEntity.ok("Review deleted successfully");
        } catch(Exception e) {
            return ResponseEntity.status(401).body("You are not authorized to delete this review.");
        }
    }

}
