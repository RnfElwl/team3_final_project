package com.ict.backend.controller;
import com.ict.backend.service.MovieService;
import com.ict.backend.vo.MovieImgVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RatingVO;
import com.sun.tools.jconsole.JConsoleContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")  // React 서버 주소
@RestController
@RequestMapping("/api/movies")

public class MovieController {

    // 영화 데이터 가져오는 service
    @Autowired
    private MovieService movieService;

    // Categories 페이지
    // 특정 장르의 영화를 가져오는 API
    @GetMapping("/genre/{genre}")
    public List<MovieVO> getMoviesByGenre(@PathVariable("genre") String genre) {
        return movieService.getMoviesByGenre(genre);
    }

    // 특정 연도의 영화를 가져오는 API
    @GetMapping("/year/{yearRange}")
    public ResponseEntity<List<MovieVO>> getMoviesByYearRange(@PathVariable String yearRange) {
        List<MovieVO> movies = movieService.getMoviesByYearRange(yearRange);
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    // 특정 국가의 영화를 가져오는 API
    @GetMapping("/nation/{nation}")
    public List<MovieVO> getMoviesByNation(@PathVariable("nation") String nation) {
        return movieService.getMoviesByNation(nation);
    }
    @GetMapping("/search/{word}")
    public List<MovieVO> getMoviesBySearch(@PathVariable("word") String word){
        return movieService.getMoviesBySearch(word);
    }

    // MovieView 페이지
//    @GetMapping("/{movieCode}")
//    public MovieVO getMovieByCode(@PathVariable String movieCode) {
//        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        return movieService.getMovieByCode(movieCode);
//    }
    @GetMapping("/{movieCode}")
    public ResponseEntity<Map<String, Object>> getMovieByCode(@PathVariable String movieCode) {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        if(userid == "anonymousUser"){
            userid = "";
        }
        MovieVO movie = movieService.getMovieByCode(movieCode);

        Map<String, Object> response = new HashMap<>();
        response.put("movieVO", movie);
        response.put("userid", userid);

        return ResponseEntity.ok(response);
    }

    // movie_code에 해당하는 이미지 목록을 가져오는 API
    @GetMapping("/{movieCode}/images")
    public ResponseEntity<List<String>> getMovieImages(@PathVariable("movieCode") String movieCode) {
        List<String> images = movieService.getMovieImagesByCode(movieCode);
        if (images != null && !images.isEmpty()) {
            return ResponseEntity.ok(images);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 평균평점과 리뷰 개수 가져오기
    @GetMapping("/{movieCode}/rating")
    public RatingVO getRating(@PathVariable("movieCode") String movieCode) {
        // movieCode로 movieNo를 조회
        int movieNo = movieService.getMovieNoByCode(movieCode);
        // 조회된 movieNo로 평점 및 리뷰 개수 반환
        return movieService.getRatingByMovieNo(movieNo);
    }

    @PostMapping("/hit")
    public int insertMovieHit(@RequestBody MovieVO movieVO){
        int no = movieVO.getMovie_no();
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        String genre = movieVO.getMovie_genre();
        try{
        movieService.updateMovieHit(no);
        if(userid == "anonymousUser"){
            return 1;
        }
        movieService.insertMovieHiStory(userid, no);
        }catch (Exception e){
            System.out.println(e.getMessage());
            return 0;
        }

        return 1;
    }





}
