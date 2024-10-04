package com.ict.backend.vo;

import lombok.Data;

@Data
public class MovieVO {
    private String movie_code; // 영화별 고유 코드
    private String movie_kor; // 영화명(한글)
    private String movie_eng;// 영화명(영문)
    private String movie_type;
    private String movie_genre;
    private String movie_nation;
    private String movie_actors;
    private String movie_showtime;
    private String opened_year;
    private String movie_grade;
    private String movie_directors;
    private String movie_poster;
    private String movie_link;



}
