package com.ict.backend.vo;

import lombok.Data;

@Data
public class CommunityLikeVO {
    public int community_no;
    public String userid;

    // 매개변수를 받는 생성자 추가
    public CommunityLikeVO(int community_no, String userid) {
        this.community_no = community_no;
        this.userid = userid;
    }
}
