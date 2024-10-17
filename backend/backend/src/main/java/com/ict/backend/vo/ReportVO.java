package com.ict.backend.vo;

import lombok.Data;

@Data
public class ReportVO {
    private String report_userid;
    private String reported_userid;
    private String report_content;
    private int report_tblname;
    private int report_tblno;
    private String report_tbluuid;
    private String report_state;
    private String report_date;
    private String report_type;
    private String  report_reason;
    private String edit_date;
    private int edit_state;
    private String edit_user;
    private int user_state;
    private int active_state;

}
