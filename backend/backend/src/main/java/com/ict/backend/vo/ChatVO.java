package com.ict.backend.vo;

import lombok.Data;

@Data
public class ChatVO {
    private String chatlist_url;
    private String userid;
    private String chat_content;
    private String chat_date;
}
