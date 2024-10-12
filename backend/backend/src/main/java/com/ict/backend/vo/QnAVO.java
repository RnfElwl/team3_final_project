package com.ict.backend.vo;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class QnAVO {
    public int qna_no;
    public String userid;
    public String usernick;
    public String head_title;
    public String qna_title;
    public String qna_content;
    public String qna_writedate;
    public int qna_state;
    public String qna_answer;
    public String answer_user;
    public String qna_answer_date;
    public int privacyQ;
    public int active_state;
    public String qna_pwd;
    public String qna_img;
}
