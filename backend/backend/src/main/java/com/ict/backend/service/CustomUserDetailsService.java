package com.ict.backend.service;

import com.ict.backend.dao.UserDAO;
import com.ict.backend.dto.CustomUserDetails;
import com.ict.backend.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserDAO dao;

    @Override
    public UserDetails loadUserByUsername(String userid) throws UsernameNotFoundException {
        MemberVO memberVO = dao.findByUserid(userid);
        if (memberVO != null) {
            return new CustomUserDetails(memberVO);
        }
        return null;
    }
}
