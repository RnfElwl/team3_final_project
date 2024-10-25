package com.ict.backend.dao;

import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;

import java.util.List;

public interface EventDAO {
    public List<EventVO> selectEventList();
    public List<EventNoticeVO> selectNoticeList();
    public EventVO selectEventPage(int event_no);
    public EventNoticeVO selectNoticePage(int notice_no);
    public int updatePointMinus(String userid, int point);
    public int updatePointAdd(String userid, int point);
}
