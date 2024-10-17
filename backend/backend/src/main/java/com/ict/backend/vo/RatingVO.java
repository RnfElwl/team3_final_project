package com.ict.backend.vo;

import lombok.Data;

@Data
public class RatingVO {

//    private int rate;
//    private int movie_no;
    private double avg_rating;  // 평균 평점
    private int review_count;  // 리뷰 개수

}
