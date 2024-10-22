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

    // 특정 유저가 영화에 대해 이미 리뷰를 작성했는지 확인
    @Override
    public boolean checkReviewExists(int movieNo, String userid) {
        // 전달된 파라미터를 콘솔에 출력
        System.out.println("checkReviewExists() called with:");
        System.out.println("movieNo: " + movieNo);
        System.out.println("userid: " + userid);
        try {
            System.out.println("Calling DAO to check review existence...");
            int count = reviewDAO.countUserReview(movieNo, userid); // DAO 호출
            System.out.println("countUserReview() result: " + count);
            return count > 0;
        } catch (Exception e) {
            System.out.println("Error in DAO call:");
            e.printStackTrace(); // 예외 출력
            return false;
        }
    }
    // 추가
    @Override
    public void addReview(ReviewVO reviewVO) {
        reviewDAO.insertReview(reviewVO);
    }

    // 리뷰 띄우기
    @Override
    public List<ReviewVO> getReviewsByMovieCode(String movieCode) {
        return reviewDAO.selectReviewsByMovieCode(movieCode);
    }

    // 특정 리뷰 선택
    @Override
    public ReviewVO getReviewById(int movieReviewNo) {
        System.out.println("Service - Fetching review by reviewNo: " + movieReviewNo);
        return reviewDAO.selectReviewById(movieReviewNo);
    }
    // 리뷰 업데이트
    @Override
    public void updateReview(ReviewVO updatedReview) {
        try {
            reviewDAO.updateReview(updatedReview);
        } catch (Exception e) {
            // SQL 예외 로그 출력
            e.printStackTrace();
            throw new RuntimeException("Failed to update review", e);
        }
    }
    // 리뷰 삭제
    @Override
    public void deleteReview(int movieReviewNo, String loggedInUserId) {
        reviewDAO.deleteReview(movieReviewNo, loggedInUserId);
    }


}
