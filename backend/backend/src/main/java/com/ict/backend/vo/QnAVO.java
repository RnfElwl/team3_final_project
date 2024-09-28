package com.ict.backend.vo;

import lombok.Data;

@Data
public class QnAVO {
    public int qna_no;
    public String userid;
    public String head_title;
    public String qna_title;
    public String qna_writedate;
    public int qna_state;
    public String qna_answer;
    public String answer_user;
    public String qna_answer_date;
    public int privacy;
    public int active_state;
}
