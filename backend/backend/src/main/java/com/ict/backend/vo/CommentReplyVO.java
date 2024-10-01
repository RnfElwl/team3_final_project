package com.ict.backend.vo;

import lombok.Data;

@Data
public class CommentReplyVO {
    public int reply_no;
    public String userid;
    public int comment_no;
    public String reply_writedate;
    public String edit_date;
    public String edit_user;
    public String active_state;
}
