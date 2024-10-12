package com.ict.backend.service;

import com.ict.backend.dao.UserDAO;
import com.ict.backend.vo.ImageVO;
import com.ict.backend.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class UserServiceImpl  implements UserService {
    @Autowired
    UserDAO dao;


    @Override
    public MemberVO test() {
        System.out.println("serviceimpl");
        return dao.test();
    }

    @Override
    public MemberVO getUserInfo(String userid) {
        return dao.getUserInfo(userid);
    }

    @Override
    public int updateUserInfo(MemberVO user) {
        return dao.updateUserInfo(user);
    }
    @Override
    public int changepassword(String userid, String userpwd, String newpassword){
        return dao.changepassword(userid, userpwd, newpassword);
    }
    @Override
    public String userprofile(String userid){
        return dao.userprofile(userid);
    }

    @Override
    public int uploadImage(String imageUrl) {
        ImageVO imageVO = new ImageVO();
        imageVO.setImage_url(imageUrl);
        dao.uploadImage(imageVO);
        return imageVO.getImage_no();  // image_no를 반환
    }

    @Override
    public int updateprofile(int imgurl, String userid) {
        return dao.updateprofile(imgurl, userid);
    }

    @Override
    public int updateimageurl(String imgurl, int profileno) {
        return dao.updateimageurl(imgurl, profileno);
    }
    @Override
    public int userprofileno(String userid){
        return dao.userprofileno(userid);
    }




}
