package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.service.JoinService;
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
        String chatlist_url = UUIDUtils.createType4UUID();
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        chatListVo.setChatlist_url(chatlist_url);
        chatListVo.setChatlist_headcount(1);

        chatListVo.setUserid(userid);
        chatListService.insertChatList(chatListVo);
        chatListService.insertChatEnter(chatlist_url, userid);
        return "";
    }
    @GetMapping("/openChatList")
    public List<ChatListVO> selectOpenChatList(){

        List<ChatListVO> list = chatListService.selectOpenChatList();
        System.out.println(list);

        return  list;
    }
    @GetMapping("/{chatlist_url}")
    public List<ChatVO> selectChatContent(@PathVariable String chatlist_url){
        System.out.println("-----------------");
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ChatVO> list = chatListService.selectChatContent(chatlist_url, userid);

        return list;
    }
    @PostMapping("/userlistadd/{chatlist_url}")
    public int insertChatUserList(@PathVariable String chatlist_url){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return chatListService.insertChatEnter(chatlist_url, userid);
    }
    @GetMapping("/roominfo")
    public ChatListVO selectRoomInfo(@RequestParam String chatlist_url){
        return chatListService.selectChatRoom(chatlist_url);
    }
    @GetMapping("/member-list")
    public List<ChatVO> selectChatMember(@RequestParam String chatlist_url){
        System.out.println(chatlist_url);
        return chatListService.selectChatMember(chatlist_url);
    }
    @PostMapping("/headcount")
    public int updateChatHeadCount(@RequestBody String chatlist_url){
        System.out.println(chatlist_url);
        return chatListService.updateChatHeadCount(chatlist_url);
    }
}
