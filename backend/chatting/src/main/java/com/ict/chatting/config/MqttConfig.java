package com.ict.chatting.config;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttConfig {

    // MQTT 브로커에 연결하기 위한 설정
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{"tcp://localhost:1883"}); // MQTT 브로커 주소
        options.setCleanSession(true); // 클린 세션 옵션
        factory.setConnectionOptions(options);
        return factory;
    }

    // MQTT 메시지를 받는 채널
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    // 채팅방 주제에 따라 동적으로 구독하기 위한 설정
    @Bean
    public MessageProducer inbound(String roomId) {
        // MQTT에서 메시지를 구독하는 어댑터 생성, 주제를 각 채팅방(roomId)로 구분
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("mqttClientId-" + roomId, mqttClientFactory(), "chat/" + roomId);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel()); // 메시지를 받을 채널 설정
        return adapter;
    }

    // MQTT로 메시지를 발행하기 위한 설정
    @Bean
    public MessageHandler outbound() {
        MqttPahoMessageHandler messageHandler =
                new MqttPahoMessageHandler("mqttClientIdOutbound", mqttClientFactory());
        messageHandler.setAsync(true); // 비동기 전송
        messageHandler.setDefaultTopic("chat/default"); // 기본 채널
        return messageHandler;
    }
}