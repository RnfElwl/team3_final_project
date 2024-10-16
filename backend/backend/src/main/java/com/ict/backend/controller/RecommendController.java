package com.ict.backend.controller;

import com.ict.backend.service.RecommendService;
import com.ict.backend.vo.BookmarkVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import com.ict.backend.vo.ReviewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/recommend")
public class RecommendController {

    @Autowired
    RecommendService service;

    @GetMapping("/list")
    public List<MovieVO> getRecommendInfo(){
        return service.getRecommendInfo();
    }

    @PostMapping("/rate")
    public RecommendVO recommendRate (@RequestBody RecommendVO vo){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        vo.setUserid(userid);

        String movie_genre = vo.getMovie_genre();
        int count = vo.getCount();

        System.out.println(vo.toString());
        service.recommendRate(movie_genre, userid, count);
        return vo;
    }

    @GetMapping("/bookmark")
    public List<MovieVO> getMoviesByBookmarkCount(){
        return service.getMoviesByBookmarkCount();
    }
    @GetMapping("/release")
    public List<MovieVO> getMoviesByReleaseDate(){
        return service.getMoviesByReleaseDate();
    }
    @GetMapping("/review")
    public List<MovieVO> getMoviesByReviewCount(){
        return service.getMoviesByReviewCount();
    }
    @GetMapping("/rating")
    public List<MovieVO> getMoviesByRating(){
        return service.getMoviesByRating();
    }
    @GetMapping("/hit")
    public List<MovieVO> getMoviesByViewCount(){
        return service.getMoviesByViewCount();
    }
    @GetMapping("/genre")
    public List<MovieVO> getGenre(){
        return service.getGenre();
    }
    @GetMapping("/age")
    public List<MovieVO> getAge(){
        return service.getAge();
    }
    @GetMapping("/gender")
    public List<MovieVO> getGender(){
        return service.getGender();
    }
//    @GetMapping("/homeList")
//    public  List<MovieVO> getMovies(
//            @RequestParam String category,
//            @RequestParam String sortBy){
//
//        switch (sortBy) {
//            case "bookmark":
//                return service.getMoviesByBookmarkCount(category);
//            case "release_date":
//                return service.getMoviesByReleaseDate(category);
//            case "review_count":
//                return service.getMoviesByReviewCount(category);
//            case "rating":
//                return service.getMoviesByRating(category);
//            case "view_count":
//                return service.getMoviesByViewCount(category);
//            default:
//                return new ArrayList<>();
//        }
//    }
}
