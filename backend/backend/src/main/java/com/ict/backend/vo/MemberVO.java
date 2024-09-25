package com.ict.backend.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberVO {
    private String userid;
    private String userpwd;
    private String role;
    private String username;
    private String password;
    private String email;
    private String tel;
    private int zipcode;
    private String address;
    private String addrdetail;
    private String hobby;
    private String writedate;
}
