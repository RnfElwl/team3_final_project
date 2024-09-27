package com.ict.backend.controller;

import com.ict.backend.service.CommunityService;
import com.ict.backend.vo.CommunityVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/community")
public class CommunityController {
    @Autowired
    CommunityService service;

    //list

    //write
    @GetMapping("/communityWrite")
    public String communityWrite(){
        return "community/communityWrite";
    }
    //글등록 DB
    @PostMapping("/communityWriteOk")
    public String communityWriteOk (CommunityVO community, HttpServletRequest request, Model model){
        // community.setIp(request.getRemoteAddr());
        community.setUserid((String)request.getSession().getAttribute("logId"));
        int result=0;
        try {
            result = service.communityInsert(community);
        }catch(Exception e){

        }
        model.addAttribute("result", result);
        return "community/communityResult";
    }
}