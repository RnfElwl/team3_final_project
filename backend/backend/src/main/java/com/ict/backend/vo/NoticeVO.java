package com.ict.backend.vo;

import lombok.Data;

@Data
public class NoticeVO {
    private Integer notice_no;
    private String notice_title;
    private String notice_content;
    private String userid;
    private String write_date;
    private Integer active_state;

    private String searchKey;
    private String searchWord;
}
