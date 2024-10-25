package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.service.EventService;
import com.ict.backend.service.JoinService;
import com.ict.backend.service.UserService;
import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;
import com.ict.backend.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventController {

    @Autowired
    JoinService joinService;

    private EventService eventService;
    @Autowired
    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @GetMapping("/event-list")
    public List<EventVO> selectEventList(){
        return eventService.selectEventList();
    }
    @GetMapping("/notice-list")
    public List<EventNoticeVO> selectNoticeList(){
        return eventService.selectNoticeList();
    }
    @GetMapping("/{event_no}")
    public EventVO selectEventPage(@PathVariable int event_no){
        return eventService.selectEventPage(event_no);
    }
    @GetMapping("/notice/{notice_no}")
    public EventNoticeVO selectNoticePage(@PathVariable int notice_no){
        return eventService.selectNoticePage(notice_no);
    }
    @PostMapping("/point/minus")
    public int updatePointMinus(int point){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        MemberVO memberVO =  joinService.findByUserid(userid);
        int user_point = memberVO.getUser_point();
        if(user_point < point){
            return 0;
        }
        return eventService.updatePointMinus(userid, point);
    }
    @PostMapping("/point/add")
    public int updatePointAdd(int point){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return eventService.updatePointAdd(userid, point);
    }



}
