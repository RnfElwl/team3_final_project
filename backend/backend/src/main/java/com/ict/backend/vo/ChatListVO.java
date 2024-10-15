package com.ict.backend.vo;

import lombok.Data;

@Data
public class ChatListVO {
    private String chatlist_url;
    private String chat_title;
    private String userid;
    private String chat_content;
    private int chatlist_type;
    private int chatlist_headcount;
    private int chatlist_img;
    private String usernick;
    private String image_url;
    private String userprofile;
    private String user2;

    private int flag;

}
