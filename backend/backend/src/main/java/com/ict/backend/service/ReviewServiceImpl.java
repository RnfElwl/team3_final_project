package com.ict.backend.service;

import com.ict.backend.dao.ReviewDAO;
import com.ict.backend.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewDAO reviewDAO;

    @Override
    public void addReview(ReviewVO reviewVO) {
        reviewDAO.insertReview(reviewVO);
    }

    @Override
    public List<ReviewVO> getReviewsByMovieCode(String movieCode) {
        return reviewDAO.selectReviewsByMovieCode(movieCode);
    }

    @Override
    public ReviewVO getReviewById(int movieReviewNo) {
        System.out.println("Service - Fetching review by reviewNo: " + movieReviewNo);
        return reviewDAO.selectReviewById(movieReviewNo);
    }

    @Override
    public void updateReview(ReviewVO updatedReview) {
        try {
            // 리뷰 업데이트 실행
            reviewDAO.updateReview(updatedReview);
        } catch (Exception e) {
            // SQL 예외 로그 출력
            e.printStackTrace();
            throw new RuntimeException("Failed to update review", e);
        }
    }

    @Override
    public void deleteReview(int movieReviewNo) {
        reviewDAO.deleteReview(movieReviewNo);
    }


}
