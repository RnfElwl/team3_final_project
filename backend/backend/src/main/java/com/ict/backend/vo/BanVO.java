package com.ict.backend.vo;

import lombok.Data;

@Data
public class BanVO {
    private String userid;
    private String start_banDate;
    private String stop_banDate;
    private String banContent;
    private String editBanDate;

    private String username;
    private String usernick;
    private Integer active_state;
    private String regiserdate;
    private Integer reported_count;
}
