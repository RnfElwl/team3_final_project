package com.ict.backend.dao;

import com.ict.backend.vo.MovieVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface MovieDAO {

    List<MovieVO> getMoviesByGenre(String genre);
    List<MovieVO> getMoviesByYear(String year);
    List<MovieVO> getMoviesByNation(String nation);
    List<MovieVO> getMoviesByYearRange(String yearRange);
    // 영화 코드를 기반으로 영화 정보를 가져오는 메서드
    MovieVO getMovieByCode(@Param("movieCode") String movieCode);

}
