package com.ict.chatting.controller;

import com.ict.chatting.gateway.MqttGateway;
import com.ict.chatting.vo.ChatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private MqttGateway mqttGateway;

    // 특정 채팅방으로 메시지를 전송 (STOMP 경로 "/chat/{roomId}" 사용)
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId, ChatVO vo) {
        // 메시지를 각 채팅방의 MQTT 토픽에 발행
        mqttGateway.sendToMqtt(vo, "chat/" + roomId);
    }

    // 특정 채팅방으로 전송된 메시지를 구독하는 곳에 전송
    @SendTo("/topic/{roomId}")
    public ChatVO broadcastMessage(ChatVO vo) {
        return vo;  // 메시지와 함께 유저 정보도 클라이언트로 전송
    }
}