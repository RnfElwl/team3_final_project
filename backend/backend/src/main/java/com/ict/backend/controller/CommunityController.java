package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    CommunityService service;

    //list

    //write
    @GetMapping("/communityWrite")
    public String communityWrite(){
        return "";
    }
    //글등록 DB
    @PostMapping("/communityWriteOk")
    public String communityWriteOk (CommunityVO community){
        // community.setIp(request.getRemoteAddr());
        int result=0;
        try {
            result = service.communityInsert(community);
        }catch(Exception e){

        }
        //return "community/communityResult";
        return "";
    }
}