package com.ict.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinDTO {
    private String userid;
    private String userpwd;
    private String username;
    private String usernick;
    private String usertel;
    private String zipcode;
    private String useraddr;
    private String addrdetail;
    private String useremail;
    private String gender;
    private String userbirth;
    private String user_social;

    @Override
    public String toString() {
        return "JoinDTO{" +
                "userid='" + userid + '\'' +
                ", userpwd='" + userpwd + '\'' +
                ", username='" + username + '\'' +
                ", usernick='" + usernick + '\'' +
                ", usertel='" + usertel + '\'' +
                ", useremail='" + useremail + '\'' +
                ", useraddr='" + useraddr + '\'' +
                ", zipcode='" + zipcode + '\'' +
                ", addrdetail='" + addrdetail + '\'' +
                ", userbirth='" + userbirth + '\'' +
                ", gender='" + gender + '\'' +
                ", user_social = " + user_social + '\'' +
                '}';
    }
}
