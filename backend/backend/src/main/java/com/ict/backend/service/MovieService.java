package com.ict.backend.service;

import com.ict.backend.vo.MovieImgVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RatingVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public interface MovieService {
    List<MovieVO> getMoviesByGenre(String genre);
    List<MovieVO> getMoviesByYearRange(String yearRange);
    List<MovieVO> getMoviesByNation(String nation);
    List<MovieVO> getMoviesBySearch(String word);
    MovieVO getMovieByCode(String movieCode);

    // 이미지 가져오기
    List<String> getMovieImagesByCode(String movieCode);

    // movie_code로 movie_no 받아오기
    int getMovieNoByCode(String movieCode); // movieCode로 movieNo 조회
    // 평균평점, 리뷰개수
    RatingVO getRatingByMovieNo(int movieNo);

    int updateMovieHit(int movie_no);
    int insertMovieHiStory(String userid, int movie_no);


}
