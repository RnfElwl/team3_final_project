package com.ict.chatting.gateway;

import com.ict.chatting.vo.ChatVO;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel = "mqttOutboundChannel")
public interface MqttGateway {
    void sendToMqtt(ChatVO vo, @Header("mqtt_topic") String topic);
}
