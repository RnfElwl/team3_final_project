package com.ict.backend.service;

import com.ict.backend.dao.RefreshDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefreshServiceImpl implements RefreshService {
    @Autowired
    private RefreshDAO dao;

    @Override
    public void saveRefresh(String userid, String refreshtoken, Long expiresInDays) {
        dao.saveRefresh(userid, refreshtoken, expiresInDays);
    }

    @Override
    public int checkRefresh(String userid) {
        return dao.checkRefresh(userid);
    }

    @Override
    public void updateRefresh(String userid, String refreshToken, Long expiresInDays) {
        dao.updateRefresh(userid, refreshToken, expiresInDays);
    }
}
