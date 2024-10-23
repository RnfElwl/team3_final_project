package com.ict.backend.service;

import com.ict.backend.dao.MovieDAO;
import com.ict.backend.dao.RecommendDAO;
import com.ict.backend.vo.BookmarkVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import com.ict.backend.vo.ReviewVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendServiceImpl implements RecommendService{

    @Inject
    RecommendDAO dao;

    @Override
    public List<MovieVO> getRecommendInfo() {
        return dao.getRecommendInfo();
    }

    @Override
    public void recommendRate(String movie_genre, String userid, int count) {
        // count에 따라 장르를 여러 번 저장
        for (int i = 0; i < count; i++) {
            dao.recommendRate(movie_genre, userid, count);
        }
     }

    @Override
    public List<MovieVO> getMoviesByBookmarkCount() {
        return dao.getMoviesByBookmarkCount();
    }

    @Override
    public List<MovieVO> getMoviesByReleaseDate() {
        return dao.getMoviesByReleaseDate();
    }

    @Override
    public List<MovieVO> getMoviesByReviewCount() {
        return dao.getMoviesByReviewCount();
    }

    @Override
    public List<MovieVO> getMoviesByRating() {
        return dao.getMoviesByRating();
    }

    @Override
    public List<MovieVO> getMoviesByViewCount() {
        return dao.getMoviesByViewCount();
    }

    @Override
    public List<MovieVO> getGenre() {
        return dao.getGenre();
    }

    @Override
    public List<MovieVO> getAge() {
        return dao.getAge();
    }

    @Override
    public List<MovieVO> getGender() {
        return dao.getGender();
    }

    @Override
    public List<MovieVO> getRecommendedMovies(String userid, String type) {
        // 상위 3개 장르 가져오기
        List<Map<String, Object>> topGenres = new ArrayList<>();

        if(type.equals("id")) {
            topGenres = dao.getGenerByUser(userid);
        } else if(type.equals("age")) {
            topGenres = dao.getGenerByAge(userid);
        } else {
            topGenres = dao.getGenerByGender(userid);
        }

        System.out.println("Received topGenres: " + topGenres);

        // 장르와 비율을 추출하여 각 장르에 대해 영화 수 계산
        int totalMovies = 20;
        Map<String, Integer> genreCounts = new HashMap<>();

        if (topGenres == null || topGenres.isEmpty()) {
            System.out.println("topGenres is null or empty.");
        } else {
            for (Map<String, Object> genreData : topGenres) {
                String genre = (String) genreData.get("genre");
                Object ratioObj = genreData.get("adjusted_genre_ratio");
                double ratio = (ratioObj != null) ? ((Number) ratioObj).doubleValue() : 0.0;  // 안전한 형변환

                int count = (int) Math.round(totalMovies * (ratio / 100));
                genreCounts.put(genre, count);
            }
        }

        // 장르별 영화 수를 기준으로 정렬 (많은 수부터)
        List<Map.Entry<String, Integer>> sortedGenreCounts = genreCounts.entrySet()
                .stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue())) // 내림차순 정렬
                .toList();

        // 각 장르별로 영화 리스트 가져오기
        List<MovieVO> recommendedMovies = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : sortedGenreCounts) {
            String genre = entry.getKey();
            int count = entry.getValue();
            System.out.println("Fetching movies for genre: " + genre + ", Count: " + count);
            List<MovieVO> movies = dao.getMoviesByGenre(genre, count);
            recommendedMovies.addAll(movies);
        }

        System.out.println("Recommended movies: " + recommendedMovies);

        return recommendedMovies;
    }



}
