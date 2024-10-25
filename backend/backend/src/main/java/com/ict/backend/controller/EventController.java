package com.ict.backend.controller;

import com.ict.backend.service.ChatListService;
import com.ict.backend.service.EventService;
import com.ict.backend.vo.EventNoticeVO;
import com.ict.backend.vo.EventVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/event")
public class EventController {

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
    public EventVO selectNoticePage(@PathVariable int notice_no){
        return eventService.selectNoticePage(notice_no);
    }


}
