package com.ict.backend.vo;

import lombok.Data;

@Data
public class ReviewVO {

    private String userid;
    private int movie_no;
    private String movie_review_content;
    private int rate;
    private String movie_code;



}
