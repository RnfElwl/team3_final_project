package com.ict.backend.service;

import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;

import java.util.List;

public interface EventService {
    public List<EventVO> selectEventList();
    public List<EventNoticeVO> selectNoticeList();
    public EventVO selectEventPage(int event_no);
    public EventNoticeVO selectNoticePage(int notice_no);
    public int updatePointMinus(String userid, int point);
    public int updatePointAdd(String userid, int point);
    public int insertFirstCome(String userid, int no);
    public int selectEventTenCheck(int event_no);
    public int selectEventUserCheck(int event_no, String userid);
    public int updateUserPreferCheck(String userid);
}
