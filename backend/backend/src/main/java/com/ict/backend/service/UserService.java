package com.ict.backend.service;

import com.ict.backend.vo.MemberVO;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {
    public MemberVO test();
    public MemberVO getUserInfo(String userid);
    public int updateUserInfo(MemberVO user);
    public int changepassword(String userid, String encryptedNewPassword);
    public String userprofile(String userid);
    public int updateprofile(int imgurl, String userid);
    int uploadImage(String imageUrl);
    public int updateimageurl(String imgurl, int profileno);
    int userprofileno(String userid);
    public String getuserpwd(String userid);
}
