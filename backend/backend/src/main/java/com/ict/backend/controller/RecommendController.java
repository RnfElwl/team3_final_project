package com.ict.backend.controller;

import com.ict.backend.service.RecommendService;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

}
