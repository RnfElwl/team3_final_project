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
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(@PathVariable int reviewId, @RequestBody ReviewVO updatedReview) {
        // 로그인된 사용자 정보 가져오기
        String loggedInUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        ReviewVO existingReview = movieReviewService.getReviewById(reviewId);

        if (existingReview != null && existingReview.getUserid().equals(loggedInUserId)) {
            movieReviewService.updateReview(reviewId, updatedReview);
            return ResponseEntity.ok("Review updated successfully");
        } else {
            return ResponseEntity.status(401).body("You are not authorized to edit this review.");
        }
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable int reviewId) {
        // 로그인된 사용자 정보 가져오기
        String loggedInUserId = SecurityContextHolder.getContext().getAuthentication().getName();
        ReviewVO existingReview = movieReviewService.getReviewById(reviewId);

        if (existingReview != null && existingReview.getUserid().equals(loggedInUserId)) {
            movieReviewService.deleteReview(reviewId);
            return ResponseEntity.ok("Review deleted successfully");
        } else {
            return ResponseEntity.status(401).body("You are not authorized to delete this review.");
        }
    }





}
