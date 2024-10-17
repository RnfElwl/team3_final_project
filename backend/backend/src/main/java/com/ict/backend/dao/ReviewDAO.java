package com.ict.backend.dao;

import com.ict.backend.vo.ReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReviewDAO {

    // 리뷰 작성 여부 확인
    int countUserReview(@Param("movie_no") int movieNo, @Param("userid") String userid);

    // 리뷰 추가
    void insertReview(ReviewVO reviewVO);

    // 특정 영화 리뷰 조회
    List<ReviewVO> selectReviewsByMovieCode(@Param("movieCode") String movieCode);

    // 특정 리뷰 조회
    ReviewVO selectReviewById(@Param("movieReviewNo") int movieReviewNo);

    // 리뷰 수정
    void updateReview(ReviewVO reviewVO);

    // 리뷰 삭제
    void deleteReview(@Param("reviewId") int reviewId);



}
