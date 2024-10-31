package com.ict.backend.service;

import com.ict.backend.dao.ChatListDAO;
import com.ict.backend.dao.EventDAO;
import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
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
    public int insertFirstCome(String userid, int no){
        return eventDAO.insertFirstCome(userid, no);
    }

    public int selectEventTenCheck(int event_no){
        return eventDAO.selectEventTenCheck(event_no);
    }
    public int selectEventUserCheck(int event_no, String userid){
        return eventDAO.selectEventUserCheck(event_no, userid);
    }
    public int updateUserPreferCheck(String userid){
        return eventDAO.updateUserPreferCheck(userid);
    }

}
