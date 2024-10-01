package com.ict.chatting.controller;

import com.ict.chatting.gateway.MqttGateway;
import com.ict.chatting.vo.ChatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins =  "*")
public class ChatController {

    @MessageMapping("/send")
    @SendTo("/topic/messages")
    public ChatVO send(ChatVO message) {
        return message; // 클라이언트에 메시지를 전송
    }
}