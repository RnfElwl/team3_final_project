package com.ict.backend.service;

import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;

import java.util.List;

public interface EventService {
    public List<EventVO> selectEventList();
    public List<EventNoticeVO> selectNoticeList();
    public EventVO selectEventPage(int event_no);
    public EventNoticeVO selectNoticePage(int notice_no);
}
