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
    private String zipcode;
    private String useraddr;
    private String addrdetail;
    private String usertel;
    private String useremail;
    private String userbirth;
    private String gender;
    private String userprofile;
    private String image_url;
    private String regiserdate;
    private String role;
    private String password;
    private String ROLE_ADMIN;
    private int active_state;
    private int reported_count;
    private String lastvisite;
    private int user_point;
    private String user_social;
    private int user_prefercheck;
}
