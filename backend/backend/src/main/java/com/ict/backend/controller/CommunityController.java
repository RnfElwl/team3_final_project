package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community")
@CrossOrigin(origins = "http://localhost:3000") // 프론트엔드 포트를 명시
public class CommunityController {
    @Autowired
    CommunityService service;

    //list
    @GetMapping("/list")
    public List<CommunityVO> getCommunityList(){
        return service.getCommunityList();
    }
    //게시글 작성
    @PostMapping("/create")
    public CommunityVO communityInsert (@RequestBody CommunityVO vo){
        System.out.println(vo.toString());
        service.createCommunity(vo);
        return vo;
    }

    //view
    @GetMapping("/view/{community_no}")
    public CommunityVO getCommunityView(@PathVariable("community_no") int community_no){
        CommunityVO communityVO = service.getCommunityView(community_no);
        return communityVO;
    }
}