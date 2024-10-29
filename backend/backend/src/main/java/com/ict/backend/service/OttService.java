package com.ict.backend.service;
import com.ict.backend.vo.OttVO;

import java.util.List;


public interface OttService {
    int getMovieNoByCode(String movieCode);  // movie_code로 movie_no 조회
    List<OttVO> getOttInfoByMovieNo(int movieNo);  // movie_no로 OTT 정보 조회
}
