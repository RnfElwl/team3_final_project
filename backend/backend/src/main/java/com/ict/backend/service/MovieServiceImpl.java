package com.ict.backend.service;

import com.ict.backend.dao.MovieDAO;
import com.ict.backend.vo.MovieImgVO;
import com.ict.backend.vo.MovieVO;
import com.ict.backend.vo.RatingVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private final MovieDAO movieDAO;
    private MovieImgVO movieImgDAO;

    @Autowired
    public MovieServiceImpl(MovieDAO movieDAO) {
        this.movieDAO = movieDAO;
    }

    @Override
    public List<MovieVO> getMoviesByGenre(String genre) {
        return movieDAO.getMoviesByGenre(genre);
    }

    @Override
    public List<MovieVO> getMoviesByYearRange(String yearRange) {
        return movieDAO.getMoviesByYearRange(yearRange);
    }

    @Override
    public List<MovieVO> getMoviesByNation(String nation) {
        return movieDAO.getMoviesByNation(nation);
    }

    @Override
    public List<MovieVO> getMoviesBySearch(String word){ return movieDAO.getMoviesBySearch(word);}

    @Override
    public MovieVO getMovieByCode(String movieCode) {
        return movieDAO.getMovieByCode(movieCode);
    }

    @Override
    public List<String> getMovieImagesByCode(String movieCode) {
        return movieDAO.getMovieImagesByCode(movieCode);
    }

    @Override
    public int getMovieNoByCode(String movieCode) {
        // movieCode를 통해 movieNo 조회
        return movieDAO.getMovieNoByCode(movieCode);
    }

    @Override
    public RatingVO getRatingByMovieNo(int movieNo) {
        return movieDAO.getRatingByMovieNo(movieNo);
    }

    @Override
    public int updateMovieHit(int movie_no){return movieDAO.updateMovieHit(movie_no);}
    @Override
    public int insertMovieHiStory(String userid, int movie_no){return movieDAO.insertMovieHiStory(userid, movie_no);}

}
