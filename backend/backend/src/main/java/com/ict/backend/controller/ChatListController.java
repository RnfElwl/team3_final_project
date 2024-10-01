package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.util.UUIDUtils;
import com.ict.backend.vo.ChatListVO;
import com.ict.backend.vo.ChatVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@Slf4j
    @RestController
    @RequestMapping("/chat")
    @CrossOrigin(origins = "http://localhost:3000")
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
        chatListVo.setUserid(SecurityContextHolder.getContext().getAuthentication().getName());
        System.out.println(chatListVo.toString());
        chatListService.insertChatList(chatListVo);
        return "";
    }
    @GetMapping("/openChatList")
    public List<ChatListVO> selectOpenChatList(){

        List<ChatListVO> list = chatListService.selectOpenChatList();
        System.out.println(list);

        return  list;
    }
}
