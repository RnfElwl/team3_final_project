package com.ict.backend.dao;

import com.ict.backend.dto.UserDto;
import com.ict.backend.vo.MemberVO;

import java.util.Optional;

public interface UserDAO {
    public MemberVO test();

    MemberVO findByUserid(String userid);

    // 사용자 이름이 존재하는지 확인
    Boolean existsByUserid(String userid);

    // 새로운 사용자 저장
    void saveUser(MemberVO user);
}
