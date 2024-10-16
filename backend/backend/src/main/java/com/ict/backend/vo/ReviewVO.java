package com.ict.backend.vo;

import lombok.Data;

@Data
public class ReviewVO {

    private int movie_review_no;
    private String userid;
    private int movie_no;
    private String movie_review_content;
    private int rate;
    private String movie_code;
    private int movie_review_no;

<<<<<<< HEAD
=======
    private double avgRating; // 평균 별점 추가
    private int reviewCount; // 리뷰 개수 추가


>>>>>>> b001bdcded26e94ed93e1968c6d86810934d482e
}
