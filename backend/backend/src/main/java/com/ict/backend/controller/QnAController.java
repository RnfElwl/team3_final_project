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
        List<QnAVO> result = qnaService.getQnAList(pagingVO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @GetMapping("/view/{qna_no}")
    public ResponseEntity<List<QnAVO>> getQnAList(@PathVariable int qna_no) {
        List<QnAVO> result = qnaService.getQnAView(qna_no);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


}
