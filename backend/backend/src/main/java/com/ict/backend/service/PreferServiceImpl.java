package com.ict.backend.service;

import com.ict.backend.dao.PreferDAO;
import com.ict.backend.vo.PreferVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PreferServiceImpl implements PreferService {

    @Autowired
    private PreferDAO preferDAO;

    @Override
    public String getGenreByMovieCode(String movieCode) {
        return preferDAO.getGenreByMovieCode(movieCode);
    }

    @Override
    public void saveUserPreference(PreferVO preferVO) {
        System.out.println("Service: Saving preference: " + preferVO); // 로그 추가
        preferDAO.saveUserPreference(preferVO);
    }

}
