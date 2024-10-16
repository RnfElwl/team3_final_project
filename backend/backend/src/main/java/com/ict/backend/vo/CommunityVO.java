package com.ict.backend.vo;

import lombok.Data;

@Data
public class CommunityVO {
    public int community_no;
    public String userid;
    private String usernick;
    public String userprofile;
    public String community_title;
    public String community_content;
    public int community_like;
    public String community_writedate;
    public String community_img;
    public int hit;
    public String edit_date;
    public String edit_state;
    public String edit_user;
    public String active_state;
    public String loc;
    public int category;
    public int privacy;
    public int like_state;
    public int follow;
}