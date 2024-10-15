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
        List<ReviewVO> reviews = movieReviewService.getReviewsByMovieCode(movieCode);
        return ResponseEntity.ok(reviews);
    }



}
