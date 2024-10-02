package com.ict.backend.controller;

import com.ict.backend.service.QnAService;
import com.ict.backend.vo.PagingVO;
import com.ict.backend.vo.QnAVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/qna")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class QnAController {
    @Autowired
    QnAService qnaService;

    @Value("${upload.dir:D:/uploads}") // 기본 경로 설정
    private String uploadDir;
    //글 목록 불러오기
    @GetMapping("/list")
    public ResponseEntity<List<QnAVO>> getQnAList(@ModelAttribute PagingVO pagingVO){
        List<QnAVO> result = qnaService.getQnAList(pagingVO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    //총 페이지 수 구하기
    @GetMapping("/totalPages")
    public int totalPages(@ModelAttribute PagingVO pagingVO){
        int qnaTotalPages=qnaService.getTotalRecord(pagingVO);
        return qnaTotalPages;
    }
    //뷰페이지 구하기
    @GetMapping("/view/{qna_no}")
    public ResponseEntity<List<QnAVO>> getQnAList(@PathVariable int qna_no) {
        List<QnAVO> result = qnaService.getQnAView(qna_no);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    //글 등록
    @PostMapping("/writeOk")
    public int QnaWriteOk(
            @RequestParam String qna_title,
            @RequestParam String qna_content,
            @RequestParam String head_title,
            @RequestParam int privacyQ,
            @RequestParam(required = false) String qna_pwd,
            @RequestParam int qna_state,
            @RequestParam int active_state,
            @RequestParam("qna_img") MultipartFile[] qna_img
    ) {
        // 사용자 인증 확인
        String userid = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userid == null) {
            System.out.println("등록되지 않은 사용자입니다.");
            return 3;
        } else if (userid.equals("anonymousUser")) {
            System.out.println("등록된 사용자가 없습니다.");
            return 2;
        } else {
            // uploads 폴더 경로 확인 및 생성
            try {
                Path path = Paths.get(uploadDir);
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                    System.out.println("uploads 폴더가 생성되었습니다: " + uploadDir);
                }
            } catch (IOException e) {
                e.printStackTrace();
                return -1; // 폴더 생성 실패 시 -1 반환
            }

            // QnAVO 객체 생성 및 속성 설정
            QnAVO qnaData = new QnAVO();
            qnaData.setUserid(userid);
            qnaData.setQna_title(qna_title);
            qnaData.setQna_content(qna_content);
            qnaData.setHead_title(head_title);
            qnaData.setPrivacyQ(privacyQ);
            qnaData.setQna_pwd(privacyQ == 1 ? qna_pwd : null);
            qnaData.setQna_state(qna_state);
            qnaData.setActive_state(active_state);

            List<String> imgPaths = new ArrayList<>(); // 이미지 경로 목록 생성

            for (MultipartFile img : qna_img) {
                if (!img.isEmpty()) {
                    try {
                        // 이미지 파일 이름 생성
                        String fileName = System.currentTimeMillis() + "_" + img.getOriginalFilename();
                        Path filePath = Paths.get(uploadDir, fileName);

                        // 이미지 파일 저장
                        Files.copy(img.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                        // 이미지 경로를 리스트에 추가
                        imgPaths.add(filePath.toString());
                    } catch (IOException e) {
                        e.printStackTrace();
                        return -1; // 파일 저장 실패 시 -1 반환
                    }
                }
            }

            // QnAVO에 이미지 경로 목록 설정
            qnaData.setQna_img(imgPaths.toString());

            // DB에 QnA 데이터 저장
            return qnaService.qnaInsert(qnaData);
        }
    }




}
