package com.ict.backend.service;

import com.ict.backend.dao.UserDAO;
import com.ict.backend.vo.ImageVO;
import com.ict.backend.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

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
    public int changepassword(String userid, String encryptedNewPassword){
        return dao.changepassword(userid, encryptedNewPassword);
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
    @Override
    public String getuserpwd(String userid){
        return dao.getuserpwd(userid);
    }

    @Override
    public List<Map<String, String>> getBookmarks(String userid, int limit){
        return dao.getBookmarks(userid, limit);
    }
    @Override
    public List<Map<String, String>> getHistory(String userid, int limit){
        return dao.getHistory(userid, limit);
    }
    @Override
    public List<Map<String, String>> getfollower(String userid, int limit){
        return dao.getfollower(userid, limit);
    }
    @Override
    public MemberVO getOtherUserInfo(String usernick){
        return dao.getOtherUserInfo(usernick);
    }
    @Override
    public int getCountBookmarks(String userid){
        return dao.getCountBookmarks(userid);
    }
    @Override
    public int getCountHistory(String userid){
        return dao.getCountHistory(userid);
    }
    @Override
    public int getCountfollower(String userid){
        return dao.getCountfollower(userid);
    }
    @Override
    public int getCountCommunity(String userid){
        return dao.getCountCommunity(userid);
    }
    @Override
    public int getCountComment(String userid){
        return dao.getCountComment(userid);
    }
    @Override
    public int getCountfollowing(String userid){
        return dao.getCountfollowing(userid);
    }
    @Override
    public int getCountReplyComment(String userid){
        return dao.getCountReplyComment(userid);
    }

//    @Override
//    public List<Map<String, Object>> getFollowData(String userid){
//        return dao.getFollowData(userid);
//    }
    @Override
    public List<Map<String, Object>> getFollowData(String login_user, String userid, String endpoint){
        return dao.getFollowData(login_user, userid, endpoint);
    }

    @Override
    public boolean toggleFollow(String followerUserId, String loginUser) {
        // 현재 팔로우 상태 확인
        int isFollowing = dao.isFollowing(loginUser, followerUserId);

        if (isFollowing > 0) {
            // 팔로우 중이면 팔로우 취소 (DELETE)
            return dao.deleteFollow(loginUser, followerUserId) > 0;
        } else {
            // 팔로우 중이 아니면 팔로우 추가 (INSERT)
            return dao.insertFollow(loginUser, followerUserId) > 0;
        }
    }





}
