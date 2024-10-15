package com.ict.backend.dao;

import com.ict.backend.vo.ReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
@Mapper
public interface ReviewDAO {
    void insertReview(ReviewVO reviewVO);
    List<ReviewVO> selectReviewsByMovieCode(@Param("movieCode") String movieCode);



}
