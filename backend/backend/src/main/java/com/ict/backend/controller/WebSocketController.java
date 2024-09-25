package com.ict.backend.controller;

import com.ict.backend.vo.ChatVO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WebSocketController {
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat")
    public void sendMessage(ChatVO chatVo, SimpMessageHeaderAccessor accessor) {
        chatVo.setChatlist_url("chattest");
        chatVo.setUserid("test1");
        System.out.println(chatVo.toString());
        simpMessagingTemplate.convertAndSend("/sub/chat/" + chatVo.getChatlist_url(), chatVo);
    }
}
