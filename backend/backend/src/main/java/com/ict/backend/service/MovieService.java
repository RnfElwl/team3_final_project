package com.ict.backend.service;

import com.ict.backend.vo.MovieVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public interface MovieService {
    List<MovieVO> getMoviesByGenre(String genre);
    List<MovieVO> getMoviesByYear(String year);
    List<MovieVO> getMoviesByNation(String nation);
    MovieVO getMovieByCode(String movieCode);



    // MovieVO getMovieById(int movieId); // 특정 영화 조회 메서드


}
