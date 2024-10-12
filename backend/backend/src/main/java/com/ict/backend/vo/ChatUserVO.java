package com.ict.backend.vo;

import lombok.Data;

@Data
public class ChatUserVO {
    private String chatlist_url;
    private String userid;
    private int flag;
    private String last_conn;
    private String first_conn;

}
