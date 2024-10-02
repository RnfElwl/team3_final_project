package com.ict.backend.controller;

import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.service.UserService;
import com.ict.backend.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/user")
//@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.1.*:3000"})
//@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/view")
    public String view() {
        log.info("userService -> {}", userService);

        log.info("정보 들어옴");
        log.info("{}", userService.test());
        return "hi";
    }
    @GetMapping("/userinfo")
    public String getUserInfo() {
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        if(userid.equals("anonymousUser")){
            System.out.println("등록된 사용자가 없습니다.");
            return null;
        } else{
            System.out.println(userid);
            return userid;
        }
    }
    @GetMapping("/test")
    public String test() {
        return "test";
    }
    @PostMapping("/te")
    public String login() {
        System.out.println("hi");
        //System.out.println("test"+ vo);
        return null;
    }


}
