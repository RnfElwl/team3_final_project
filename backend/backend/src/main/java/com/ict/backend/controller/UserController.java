package com.ict.backend.controller;

import com.ict.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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


}
