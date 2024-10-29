package com.ict.backend.dao;

import com.ict.backend.vo.OttVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OttDAO {
    int getMovieNoByCode(@Param("movieCode") String movieCode);  // movie_code로 movie_no 조회
    List<OttVO> getOttInfoByMovieNo(@Param("movieNo") int movieNo);  // movie_no로 OTT 정보 조회
}
