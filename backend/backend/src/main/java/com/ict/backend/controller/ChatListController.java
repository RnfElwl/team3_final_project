package com.ict.backend.controller;

import com.ict.backend.util.UUIDUtils;
import com.ict.backend.vo.ChatListVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
    @RestController
    @RequestMapping("/chat")
    @CrossOrigin(origins =  "*")
public class ChatListController {
    @PostMapping("/create")
    public String insertChatList(@RequestBody ChatListVO chatListVo){
        System.out.println(chatListVo.toString());
        chatListVo.setChatlist_url(UUIDUtils.createType4UUID());
        chatListVo.setChatlist_headcount(1);
        SecurityContextHolder.getContext().getAuthentication().getName();
        return "";
    }
}
