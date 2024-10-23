package com.ict.backend.vo;

import lombok.Data;

@Data
public class VotingVO {
    private int vote_id;
    private String schedule_id;
    private String userid;
    private int vote_value;
    private String vote_date;
}
