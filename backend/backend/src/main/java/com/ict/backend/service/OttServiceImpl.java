package com.ict.backend.service;

import com.ict.backend.dao.OttDAO;
import com.ict.backend.vo.OttVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service


public class OttServiceImpl implements OttService{

    @Autowired
    private OttDAO ottDAO;

    @Override
    public int getMovieNoByCode(String movieCode) {

        int movieNo = ottDAO.getMovieNoByCode(movieCode);  // DAO 호출하여 movie_no 조회

        if (movieNo == 0) {  // movie_no가 없을 때 처리
            throw new RuntimeException("Invalid movieCode: " + movieCode);
        }

        System.out.println("돌아온 movieNo: " + movieNo);  // 로그 추가
        return movieNo;
    }

    @Override
    public List<OttVO> getOttInfoByMovieNo(int movieNo) {
        System.out.println("Fetching OTT info for movieNo: " + movieNo);

        // OTT 정보 조회
        List<OttVO> ottList = ottDAO.getOttInfoByMovieNo(movieNo);

        if (ottList.isEmpty()) {  // OTT 정보가 없을 때 예외 처리
            throw new RuntimeException("No OTT info found for movieNo: " + movieNo);
        }

        System.out.println("Retrieved OTT List: " + ottList);  // 로그 추가
        return ottList;
    }
}
