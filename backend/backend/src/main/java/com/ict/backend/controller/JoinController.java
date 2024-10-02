package com.ict.backend.controller;

import com.ict.backend.dto.JoinDTO;
import com.ict.backend.service.JoinService;
import com.ict.backend.vo.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
@Slf4j
public class JoinController {

    @Autowired
    private JoinService service;

    @PostMapping("/join")
    public String joinProcess(JoinDTO joinDTO) {
        log.info(joinDTO.toString());
        service.joinProcess(joinDTO);

        return "ok";
    }
    @GetMapping("/getUserData")
    public MemberVO getUserData(String userid){
        System.out.println(userid+"-------------");
        return service.findByUserid(userid);
    }

}
