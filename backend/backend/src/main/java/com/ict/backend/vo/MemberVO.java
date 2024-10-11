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
    private String username;
    private String usernick;
    private int zipcode;
    private String useraddr;
    private String addrdetail;
    private String usertel;
    private String useremail;
    private String userbirth;
    private String gender;
    private String userprofile;
    private String regiserdate;
    private String role;
    private String password;
    private String ROLE_ADMIN;
}
