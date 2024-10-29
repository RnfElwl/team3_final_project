package com.ict.backend.vo;

import lombok.Data;

@Data
public class PagingVO {
    private int nowPage=1; //현재 페이지 ->페이지 번호가 없을 시 무조건 1페이지가 되게 함.
    private int onePageRecord=12; //한 번에 표시할 레코드 수 : limit의 값.
    private int offset; //페이지에 해당하는 레코드를 선택할 때 시작위치
    private int totalRecord;//총 레코드 수 DB에서 count()함수
    private int totalPage;//총페이지 수 =총레코드수와 인페이지 출력할 레코드로 계산
    private int onePageNum=5;//한번에 표시할 페이지수
    private int startPageNum=1;
    private String searchKey;//검색키
    private String searchWord;//검색어
    private String activeStateChk;
    private Integer stateChk;
    private String logId;
    private int tabActive;

    public void setNowPage(int nowPage) {
        this.nowPage = nowPage;
        //페이지 번호의 시작값을 계산
        // ((현재페이지-1)*한번에 표시할 페이지수)*한번에 표시할 페이지 수+1
        startPageNum=(nowPage-1)/onePageNum*onePageNum+1; //1,6,11,16.....
    }
    public int getOffset() {
        //레코드 선택 시작 위치 계산하기
        offset=(nowPage-1)*onePageRecord;
        return offset;
    }
    public void setTotalRecord(int totalRecord) {
        this.totalRecord = totalRecord;
        //총 페이지 수 => totalPage
        totalPage=totalRecord/onePageRecord; //5의 배수가 아니면
        if(totalRecord%onePageRecord>0) {
            totalPage++;
        }
    }

}
