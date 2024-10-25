package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.dao.EventDAO;
import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class EventServiceImpl implements EventService{
    private EventDAO eventDAO;
    @Autowired
    public EventServiceImpl(EventDAO eventDAO){
        this.eventDAO = eventDAO;
    }

    public List<EventVO> selectEventList(){
        return eventDAO.selectEventList();
    }

    public List<EventNoticeVO> selectNoticeList(){
        return eventDAO.selectNoticeList();
    }
    public EventVO selectEventPage(int event_no){
        return eventDAO.selectEventPage(event_no);
    }
    public EventNoticeVO selectNoticePage(int notice_no){
        return eventDAO.selectNoticePage(notice_no);
    }
    public int updatePointMinus(String userid, int point){
        return eventDAO.updatePointMinus(userid, point);
    }
    public int updatePointAdd(String userid, int point){
        return eventDAO.updatePointAdd(userid, point);
    }

}
