package com.ict.backend.dao;

import com.ict.backend.vo.ImageVO;
import com.ict.backend.vo.MemberVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;
import java.util.Map;

public interface UserDAO {
    public MemberVO test();

    MemberVO findByUserid(String userid);

    // 사용자 이름이 존재하는지 확인
    Boolean existsByUserid(String userid);

    // 새로운 사용자 저장
    void saveUser(MemberVO user);
    // 사용자의 정보 가져오기
    public MemberVO getUserInfo(String userid);
    // 사용자의 정보 업데이트
    public int updateUserInfo(MemberVO user);
    // 사용자 비번 업데이트
    public int changepassword(@Param("userid") String userid,
                       @Param("userpwd") String encryptedNewPassword);
    // 사용자의 프로필 유무 판단
    public String userprofile(String userid);
    // 이미지Table에 업로드 후 사용자의 정보에 No 삽입
    public int updateprofile(int imgurl, String userid);
    // 이미지 테이블에 이미지 추가
    void uploadImage(ImageVO imageVO);

    // 이미 있는 이미지에 url값 수정
    public int updateimageurl(String imgurl, int profileno);
    // 사용자 userprofileno값 받기
    public int userprofileno(String userid);
    // 사용자 비번 들고오기
    public String getuserpwd(String userid);

    public int usernickcheck(String usernick);
    public int useridcheck(String userid);

    // 사용자 관련 정보 업데이트용
    public List<Map<String, String>> getBookmarks(@Param("userid") String userid, @Param("limit") int limit);
    public List<Map<String, String>> getHistory(@Param("userid") String userid, @Param("limit") int limit);
    public List<Map<String, String>> getfollower(@Param("userid") String userid, @Param("limit") int limit);

    public MemberVO getOtherUserInfo(String usernick);

    public int getCountBookmarks(String userid);
    public int getCountHistory(String userid);
    public int getCountfollower(String userid);
    public int getCountCommunity(String userid);
    public int getCountComment(String userid);
    public int getCountfollowing(String userid);
    public int getCountReplyComment(String userid);

    //public List<Map<String, Object>> getFollowData(String userid);
    public List<Map<String, Object>> getFollowData(@Param("login_user") String login_user, @Param("userid") String userid , @Param("endpoint") String endpoint);

    int insertFollow(@Param("loginUser") String loginUser, @Param("followerUserId") String followerUserId);

    int deleteFollow(@Param("loginUser") String loginUser, @Param("followerUserId") String followerUserId);

    int isFollowing(@Param("loginUser") String loginUser, @Param("followerUserId") String followerUserId);

    public List<Map<String, String>> getCommunityList(@Param("userid") String userid, @Param("order") String order, @Param("limit") int limit);
    public List<Map<String, String>> getCommentList(@Param("userid") String userid, @Param("order") String order, @Param("limit") int limit);
    public List<Map<String, String>> getQnAList(@Param("userid") String userid, @Param("order") String order, @Param("limit") int limit);
    public List<Map<String, String>> getLikeCommunityList(@Param("userid") String userid, @Param("order") String order, @Param("limit") int limit);

    public String findidByNameAndEmail(@Param("username") String username, @Param("useremail") String useremail);
    public int findpwdByNameAndEmailAndId(@Param("userid") String userid, @Param("username") String username, @Param("useremail") String useremail);


}
