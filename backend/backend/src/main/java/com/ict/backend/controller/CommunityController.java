package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    CommunityService service;

    //list

    //write
    @GetMapping("/communityWrite")
    @PostMapping("/create")
    public CommunityVO createCommunity(@RequestBody CommunityVO vo){
        System.out.println(vo.toString());
        return vo;
    }
}