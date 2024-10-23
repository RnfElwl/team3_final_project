package com.ict.backend.vo;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class QnAVO {
    private int qna_no;
    private String userid;
    private String usernick;
    private String head_title;
    private String qna_title;
    private String qna_content;
    private String qna_writedate;
    private int qna_state;
    private String qna_answer;
    private String answer_user;
    private String qna_answer_date;
    private int privacyQ;
    private int active_state;
    private String qna_pwd;
    private String qna_img;

    //글 목록을 위한 데이터
    private Integer prev_qna_no;
    private Integer next_qna_no;
    private String prev_title;
    private String next_title;
    private String prev_privacyQ;
    private String next_privacyQ;

    //비밀글 체크를 위한 데이터
    private String privacyCheckWord;
}
