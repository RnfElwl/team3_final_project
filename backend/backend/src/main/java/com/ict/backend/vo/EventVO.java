package com.ict.backend.vo;

import lombok.Data;

@Data
public class EventVO {
    private int event_no;
    private String event_title;
    private String event_thumnail;
    private String event_content;
    private String event_wirtedate;
    private String event_startdate;
    private String event_lastdate;
    private int event_active_state;
    private String event_editer;
    private int event_point;

}
