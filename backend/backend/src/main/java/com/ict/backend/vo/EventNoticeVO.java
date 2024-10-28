package com.ict.backend.vo;

import lombok.Data;

@Data
public class EventNoticeVO {
    private int notice_no;
    private String notice_title;
    private String notice_content;
    private String write_date;
    private int active_state;
    private String userid;
}