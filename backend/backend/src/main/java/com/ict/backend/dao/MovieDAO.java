package com.ict.backend.dao;

import com.ict.backend.vo.MovieVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MovieDAO {

    List<MovieVO> getMoviesByGenre(String genre);
    List<MovieVO> getMoviesByYear(String year);
    List<MovieVO> getMoviesByNation(String nation);



    // public MovieVO getMovieById(int movieId);
}