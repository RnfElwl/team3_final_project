package com.ict.backend.dao;

import com.ict.backend.vo.PreferVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PreferDAO {

    // movie_code를 사용해 movie_genre 조회
    String getGenreByMovieCode(@Param("movie_code") String movieCode);


    // 접속 정보를 저장하는 메서드
    void saveUserPreference(PreferVO preferVO);




}
