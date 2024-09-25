package com.ict.backend.vo;

import lombok.Data;

@Data
public class MemberVO {
    private String userid;
    private String userpwd;
    private String username;
    private String email;
    private String tel;
    private int zipcode;
    private String address;
    private String addrdetail;
    private String hobby;
    private String writedate;
}
