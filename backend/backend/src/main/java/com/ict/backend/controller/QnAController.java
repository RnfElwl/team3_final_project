package com.ict.backend.controller;

import com.ict.backend.service.QnAService;
import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/qna")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class QnAController {
    @Autowired
    QnAService qnaService;

    @GetMapping("/list")
    public ResponseEntity<List<QnAVO>> getQnAList(@ModelAttribute PagingVO pagingVO){
        System.out.println("hi");
        List<QnAVO> result = qnaService.getQnAList(pagingVO);
        System.out.println("result " + result);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @GetMapping("/test")
    public String test(){
        System.out.println("hi");
        return "hi";
    }


}
