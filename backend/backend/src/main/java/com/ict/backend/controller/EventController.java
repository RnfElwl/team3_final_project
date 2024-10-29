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
    public int updatePointMinus(@RequestBody EventVO eventVO){
        System.out.println(eventVO.toString());
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        MemberVO memberVO =  joinService.findByUserid(userid);
        int user_point = memberVO.getUser_point();
        if(user_point < eventVO.getEvent_point()){
            return 0;
        }
        eventService.insertFirstCome(userid, eventVO.getEvent_no());
        return eventService.updatePointMinus(userid, eventVO.getEvent_point());
    }
    @PostMapping("/point/add")
    public int updatePointAdd(int point){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return eventService.updatePointAdd(userid, point);
    }
    @GetMapping("/user/check")
    public int selectDupCheck(@RequestParam int event_no){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return eventService.selectEventUserCheck(event_no, userid);
    }
    @GetMapping("/ten/check")
    public int selectTenCheck(@RequestParam int event_no){
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        return eventService.selectEventTenCheck(event_no);
    }

}
