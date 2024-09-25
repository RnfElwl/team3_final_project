package com.ict.backend.service;

import com.ict.backend.dao.UserDAO;
import com.ict.backend.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl  implements UserService {
    @Autowired
    UserDAO dao;


    @Override
    public MemberVO test() {
        System.out.println("serviceimpl");
        return dao.test();
    }
}
