package com.ict.backend.dao;

import com.ict.backend.vo.MovieVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MovieDAO {

    List<MovieVO> getMoviesByGenre(String genre);
    List<MovieVO> getMoviesByYear(String year);
    List<MovieVO> getMoviesByNation(String nation);

    // 영화 코드를 기반으로 영화 정보를 가져오는 메서드
    MovieVO getMovieByCode(@Param("movieCode") String movieCode);



    // public MovieVO getMovieById(int movieId);
}
