package com.ict.backend.dao;

import com.ict.backend.vo.ImageVO;
import com.ict.backend.vo.MemberVO;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

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
    // 사용자의 프로필 유무 판단
    public String userprofile(String userid);
    // 이미지Table에 업로드 후 사용자의 정보에 No 삽입
    public int updateprofile(int imgurl, String userid);
    // 이미지 테이블에 이미지 추가
    void uploadImage(ImageVO imageVO);

    // 이미 있는 이미지에 url값 수정
    public int updateimageurl(String imgurl);
    Integer getLastInsertedId();

    public int usernickcheck(String usernick);
    public int useridcheck(String userid);
}
