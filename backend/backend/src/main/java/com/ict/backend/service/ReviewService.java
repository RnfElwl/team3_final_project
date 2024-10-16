package com.ict.backend.service;

import com.ict.backend.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReviewService {

    void addReview(ReviewVO reviewVO);
    List<ReviewVO> getReviewsByMovieCode(String movieCode);
    ReviewVO getReviewById(int movieReviewNo);


    // 리뷰 수정
    void updateReview(ReviewVO reviewVO);
    // 리뷰 삭제
    void deleteReview(int movieReviewNo);



}
