package com.ict.backend.service;

import com.ict.backend.vo.MemberVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

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

    // 사용자 정보 필요용
    public List<Map<String, String>> getBookmarks(String userid, int limit);
    public List<Map<String, String>> getHistory(String userid, int limit);
    public List<Map<String, String>> getfollower(String userid, int limit);

    public MemberVO getOtherUserInfo(String usernick);

    public int getCountBookmarks(String userid);
    public int getCountHistory(String userid);
    public int getCountfollower(String userid);
    public int getCountCommunity(String userid);
    public int getCountComment(String userid);
    public int getCountfollowing(String userid);
    public int getCountReplyComment(String userid);

    //public List<Map<String, Object>> getFollowData(String userid);
    public List<Map<String, Object>> getFollowData(String login_user, String userid, String endpoint);

    boolean toggleFollow(String followerUserId, String loginUser);

    public List<Map<String, String>> getCommunityList(String userid, String order, int limit);
    public List<Map<String, String>> getCommentList(String userid, String order, int limit);
    public List<Map<String, String>> getQnAList( String userid, String order, int limit);
    public List<Map<String, String>> getLikeCommunityList(String userid, String order, int limit);

    public String findidByNameAndEmail(String username, String useremail);
    public boolean findpwdByNameAndEmailAndId(String userid, String username, String useremail);
}
