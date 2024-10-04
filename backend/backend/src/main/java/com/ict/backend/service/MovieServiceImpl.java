package com.ict.backend.service;

import com.ict.backend.dao.MovieDAO;
import com.ict.backend.vo.MovieVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieDAO movieDAO;

    @Override
    public List<MovieVO> getMoviesByGenre(String genre) {
        return movieDAO.getMoviesByGenre(genre);
    }

    @Override
    public List<MovieVO> getMoviesByYear(String year) {
        return movieDAO.getMoviesByYear(year);
    }

    @Override
    public List<MovieVO> getMoviesByNation(String nation) {
        return movieDAO.getMoviesByNation(nation);
    }

    @Override
    public MovieVO getMovieByCode(String movieCode) {
        return movieDAO.getMovieByCode(movieCode);
    }





    /*@Override
    public MovieVO getMovieById(int movieId) {
        // MovieDAO를 통해 DB에서 영화 정보를 가져옴
        return movieDAO.getMovieById(movieId);
    }*/
}
