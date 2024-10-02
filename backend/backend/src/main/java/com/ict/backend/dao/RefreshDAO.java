package com.ict.backend.dao;

public interface RefreshDAO {
    void saveRefresh(String userid, String refreshVO, Long expiresInDays);
    int checkRefresh(String userid);
    void updateRefresh(String userid, String refreshToken, Long expiresInDays);
}
