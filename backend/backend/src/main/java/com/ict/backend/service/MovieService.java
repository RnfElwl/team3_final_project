package com.ict.backend.service;

import com.ict.backend.vo.MovieImgVO;
import com.ict.backend.vo.MovieVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public interface MovieService {
    List<MovieVO> getMoviesByGenre(String genre);
    List<MovieVO> getMoviesByYearRange(String yearRange);
    List<MovieVO> getMoviesByNation(String nation);
    MovieVO getMovieByCode(String movieCode);

    // 이미지 가져오기
    List<String> getMovieImagesByCode(String movieCode);

}
