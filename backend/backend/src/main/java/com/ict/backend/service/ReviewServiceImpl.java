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



}
