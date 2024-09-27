package com.ict.backend.controller;

import com.ict.backend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class HomeController {
    @Autowired
    UserService userService;

    @GetMapping("/")
    public String home() {
        log.info("hi");
        log.info(userService.test().toString());
        return null;
    }
    @GetMapping("/edit")
    public String join() {
        log.info("hi");
        log.info(userService.test().toString());
        return "test";
    }
}
