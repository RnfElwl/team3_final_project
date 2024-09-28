package com.ict.backend.vo;

import lombok.Data;

@Data
public class CommentVO {
    public int comment_no;
    public String userid;
    public int community_no;
    public String comment_content;
    public String comment_writedate;
    public int comment_hit;
    public String edit_date;
    public String edit_state;
    public String edit_user;
    public String active_state;
}
