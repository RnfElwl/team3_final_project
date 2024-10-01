package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.util.UUIDUtils;
import com.ict.backend.vo.ChatListVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
    @RestController
    @RequestMapping("/chat")
    @CrossOrigin(origins =  "*")
public class ChatListController {
    private ChatListService chatListService;
    @Autowired
    public ChatListController(ChatListService chatListService){
        this.chatListService = chatListService;
    }

    @PostMapping("/create")
    public String insertChatList(@RequestBody ChatListVO chatListVo){
        chatListVo.setChatlist_url(UUIDUtils.createType4UUID());
        chatListVo.setChatlist_headcount(1);
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getName());
        System.out.println(chatListVo.toString());
//        chatListService.insertChatList(chatListVo);
        return "";
    }
}
