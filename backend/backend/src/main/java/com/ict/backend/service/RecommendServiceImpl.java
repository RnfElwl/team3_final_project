package com.ict.backend.service;

import com.ict.backend.dao.MovieDAO;
import com.ict.backend.dao.RecommendDAO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RecommendVO;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

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
}
