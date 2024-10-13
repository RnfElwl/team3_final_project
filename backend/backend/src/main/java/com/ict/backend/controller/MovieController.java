package com.ict.backend.controller;
import com.ict.backend.service.MovieService;
import com.ict.backend.vo.MovieImgVO;
import com.ict.backend.vo.MovieVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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

    // MovieView 페이지
    @GetMapping("/{movieCode}")
    public MovieVO getMovieByCode(@PathVariable String movieCode) {
        return movieService.getMovieByCode(movieCode);
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







}
