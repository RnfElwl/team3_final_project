package com.ict.backend.vo;

import lombok.Data;

@Data
public class ScheduleVO {
    private String schedule_id;
    private String chatlist_url;
    private String userid;
    private String schedule_title;
    private String schedule_date;
    private String schedule_deadline;
    private String schedule_addr;
    private String day;
    private String time;
}
