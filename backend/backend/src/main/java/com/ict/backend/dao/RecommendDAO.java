package com.ict.backend.dao;

import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RecommendDAO {

    List<MovieVO> getRecommendInfo();

    void recommendRate(@Param("movie_genre") String movie_genre, @Param("userid") String userid, @Param("count") int count);

}
