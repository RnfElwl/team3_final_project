package com.ict.backend.vo;

import lombok.Data;

@Data
public class NoticeVO {
    private Integer qnotice_no;
    private String qnotice_title;
    private String qnotice_content;
    private String userid;
    private String write_date;
    private Integer active_state;

    private String searchKey;
    private String searchWord;
}
