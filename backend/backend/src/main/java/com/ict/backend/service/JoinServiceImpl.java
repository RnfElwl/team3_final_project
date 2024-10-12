package com.ict.backend.service;

import com.ict.backend.dao.UserDAO;
import com.ict.backend.dto.JoinDTO;
import com.ict.backend.vo.MemberVO;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinServiceImpl implements JoinService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserDAO userDAO;  // 변수명 통일

    public JoinServiceImpl(UserDAO userDAO, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userDAO = userDAO;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public void joinProcess(JoinDTO joinDTO) {
        // 사용자 이름이 존재하는지 확인
        if (userDAO.existsByUserid(joinDTO.getUserid())) {
            System.out.println("User already exists!");
            return;  // 이미 사용자가 있으면 저장하지 않음
        }

        MemberVO memberVO = new MemberVO();
        memberVO.setUserid(joinDTO.getUserid());

        // 비밀번호 암호화
        String encodedPassword = bCryptPasswordEncoder.encode(joinDTO.getUserpwd());
        memberVO.setUserpwd(encodedPassword);  // 암호화된 비밀번호 저장
        //memberVO.setRole("ROLE_USER");
        memberVO.setUsername(joinDTO.getUsername());
        memberVO.setUsertel(joinDTO.getUsertel());
        memberVO.setUsernick(joinDTO.getUsernick());
        memberVO.setUseremail(joinDTO.getUseremail());
        memberVO.setUseraddr(joinDTO.getUseraddr());
        memberVO.setZipcode(joinDTO.getZipcode());
        memberVO.setAddrdetail(joinDTO.getAddrdetail());
        memberVO.setUserbirth(joinDTO.getUserbirth());
        memberVO.setUseremail(joinDTO.getUseremail());
        memberVO.setGender(joinDTO.getGender());

        System.out.println(memberVO);
        // DAO를 통해 데이터베이스에 저장
        userDAO.saveUser(memberVO);
    }

    @Override
    public MemberVO findByUserid(String userid) {
        return userDAO.findByUserid(userid);
    }

    @Override
    public Boolean existsByUserid(String userid) {
        return userDAO.existsByUserid(userid);
    }

    @Override
    public void saveUser(MemberVO user) {
        userDAO.saveUser(user);
    }
    @Override
    public int usernickcheck(String usernick){
        return userDAO.usernickcheck(usernick);
    }
    @Override
    public int useridcheck(String userid){
        return userDAO.useridcheck(userid);
    }
}
