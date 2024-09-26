package com.ict.backend.controller;

import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/user")
@CrossOrigin(origins =  "*")
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
        System.out.println(userid);
        return null;
    }


}
