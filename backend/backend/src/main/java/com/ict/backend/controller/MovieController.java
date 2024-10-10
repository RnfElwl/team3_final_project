package com.ict.backend.controller;

import com.ict.backend.service.MovieService;
import com.ict.backend.vo.MovieVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")  // React 서버 주소
@RestController
@RequestMapping("/api/movies")

public class MovieController {

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

    @GetMapping("/{movieCode}")
    public MovieVO getMovieByCode(@PathVariable String movieCode) {
        return movieService.getMovieByCode(movieCode);
    }


}
