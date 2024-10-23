package com.ict.backend.service;

import com.ict.backend.vo.ReviewVO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public interface ReviewService {

    // 리뷰 작성 여부 확인
    boolean checkReviewExists(int movieNo, String userid);

    // 리뷰 작성
    void addReview(ReviewVO reviewVO);

    // movieCode로 리뷰 목록 띄우기
    List<ReviewVO> getReviewsByMovieCode(String movieCode, String userid);

    // 특정 review 호출
    ReviewVO getReviewById(int movieReviewNo);

    // 리뷰 수정
    void updateReview(ReviewVO updatedReview);

    // 리뷰 삭제
    void deleteReview(int movieReviewNo, String loggedInUserId);



}
