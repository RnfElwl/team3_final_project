package com.ict.backend.dao;

import com.ict.backend.vo.ReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface ReviewDAO {

    // 리뷰 추가
    void insertReview(ReviewVO reviewVO);

    // 특정 영화 리뷰 조회
    List<ReviewVO> selectReviewsByMovieCode(@Param("movieCode") String movieCode);

    // 특정 리뷰 조회
    ReviewVO selectReviewById(@Param("reviewId") int reviewId);

    // 리뷰 수정
    void updateReview(@Param("reviewId") int reviewId, @Param("movie_review_content") String movieReviewContent, @Param("rate") int rate);

    // 리뷰 삭제
    void deleteReview(@Param("reviewId") int reviewId);



}
