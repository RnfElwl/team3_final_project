package com.ict.backend.dao;

import com.ict.backend.vo.BookmarkVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import com.ict.backend.vo.ReviewVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RecommendDAO {

    List<MovieVO> getRecommendInfo();

    void recommendRate(@Param("movie_genre") String movie_genre, @Param("userid") String userid, @Param("count") int count);

    List<MovieVO> getMoviesByBookmarkCount();

    List<MovieVO> getMoviesByReleaseDate();

    List<MovieVO> getMoviesByReviewCount();

    List<MovieVO> getMoviesByRating();

    List<MovieVO> getMoviesByViewCount();

    List<MovieVO> getGenre();

    List<MovieVO> getAge();

    List<MovieVO> getGender();
}
