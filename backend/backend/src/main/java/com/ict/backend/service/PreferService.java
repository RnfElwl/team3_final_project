package com.ict.backend.service;

import com.ict.backend.vo.PreferVO;

public interface PreferService {
    String getGenreByMovieCode(String movieCode);
    void saveUserPreference(PreferVO preferVO);
}
