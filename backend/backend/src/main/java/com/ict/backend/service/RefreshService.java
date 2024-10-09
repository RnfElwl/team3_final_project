package com.ict.backend.service;

public interface RefreshService {
    void saveRefresh(String username, String refreshtoken, Long expiresInDays);
    int checkRefresh(String userid);
    void updateRefresh(String userid, String refreshToken, Long expiresInDays);
}
