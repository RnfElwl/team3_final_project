package com.ict.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

    @Slf4j
    @RestController
    @RequestMapping("/chat")
    @CrossOrigin(origins =  "*")
public class ChatListController {

}
