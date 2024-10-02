package com.ict.backend.controller;

import com.ict.backend.service.MovieService;
import com.ict.backend.vo.MovieVO;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping("/year/{year}")
    public List<MovieVO> getMoviesByYear(@PathVariable("year") String year) {
        return movieService.getMoviesByYear(year);
    }

    // 특정 국가의 영화를 가져오는 API
    @GetMapping("/nation/{nation}")
    public List<MovieVO> getMoviesByNation(@PathVariable("nation") String nation) {
        return movieService.getMoviesByNation(nation);
    }

    // List페이지








    /*@GetMapping("/{id}")
    public MovieVO getMovieById(@PathVariable("id") int movieId) {
        // MovieService를 통해 특정 영화 정보를 가져옴
        return movieService.getMovieById(movieId);
    }*/
}
