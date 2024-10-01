package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.vo.CommunityLikeVO;
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

    //edit
    @PutMapping("/edit/{community_no}")
    public void editCommunity(@PathVariable int community_no, @RequestBody CommunityVO community){
        community.setCommunity_no(community_no);
        service.editCommunity(community);
    }

    //delete
    @DeleteMapping("/{community_no}")
    public void deleteCommunity(@PathVariable int community_no) {
        // 댓글 삭제
        service.deleteCommentsByCommunityNo(community_no); // 댓글 먼저 삭제
        service.deleteCommunity(community_no);
    }

    //like
    @PostMapping("/like")
    public void likeCommunity(@RequestBody CommunityLikeVO like){
        service.likeCommunity(like);
    }
    public int getLikesCount(@PathVariable int community_no){
        return service.getLikesCount(community_no);
    }
}