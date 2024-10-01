package com.ict.backend.service;

import com.ict.backend.dto.JoinDTO;
import com.ict.backend.vo.MemberVO;

public interface JoinService {
   public void joinProcess(JoinDTO joinDTO);
   // 사용자 이름으로 사용자 정보 찾기
   MemberVO findByUserid(String userid);

   // 사용자 이름이 존재하는지 확인
   Boolean existsByUserid(String userid);

   // 새로운 사용자 저장
   void saveUser(MemberVO user);
}
