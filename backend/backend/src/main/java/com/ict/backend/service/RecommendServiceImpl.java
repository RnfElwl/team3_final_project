package com.ict.backend.service;

import com.ict.backend.dao.MovieDAO;
import com.ict.backend.dao.RecommendDAO;
import com.ict.backend.vo.BookmarkVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import com.ict.backend.vo.ReviewVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendServiceImpl implements RecommendService{

    @Inject
    RecommendDAO dao;

    @Override
    public List<MovieVO> getRecommendInfo() {
        return dao.getRecommendInfo();
    }

    @Override
    public void recommendRate(String movie_genre, String userid, int count) {
        // count에 따라 장르를 여러 번 저장
        for (int i = 0; i < count; i++) {
            dao.recommendRate(movie_genre, userid, count);
        }
     }

    @Override
    public List<MovieVO> getMoviesByBookmarkCount() {
        return dao.getMoviesByBookmarkCount();
    }

    @Override
    public List<MovieVO> getMoviesByReleaseDate() {
        return dao.getMoviesByReleaseDate();
    }

    @Override
    public List<MovieVO> getMoviesByReviewCount() {
        return dao.getMoviesByReviewCount();
    }

    @Override
    public List<MovieVO> getMoviesByRating() {
        return dao.getMoviesByRating();
    }

    @Override
    public List<MovieVO> getMoviesByViewCount() {
        return dao.getMoviesByViewCount();
    }

    @Override
    public List<MovieVO> getGenre() {
        return dao.getGenre();
    }

    @Override
    public List<MovieVO> getAge() {
        return dao.getAge();
    }

    @Override
    public List<MovieVO> getGender() {
        return dao.getGender();
    }
}
