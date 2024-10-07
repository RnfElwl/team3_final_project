package com.ict.backend.controller;

import com.ict.backend.service.UserService;
import com.ict.backend.vo.MovieVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
public class HomeController {
    @Autowired
    UserService userService;
    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/")
    public String home() {
        log.info("hi");
        log.info(userService.test().toString());
        return null;
    }
    @GetMapping("/edit")
    public String join() {
        log.info("hi");
        log.info(userService.test().toString());
        return "test";
    }

    String apikey = "cd460f1f4499fa4cd471c22768b75144";
    @GetMapping("/movie_info")
    public ResponseEntity<byte[]> getMovies() {
    //public ResponseEntity<List<MovieVO>> getMovies() {
        String api = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key="+apikey+"&openStartDt=2020&openEndDt=2020&itemPerPage=3";

        // JSON 응답을 Map으로 직접 변환
        Map<String, Object> response = restTemplate.getForObject(api, Map.class);
        System.out.println("결과물 : " + response);
        // movieList에서 movieCd 추출
        List<String> movieCodes = ((List<Map<String, Object>>) ((Map<String, Object>) response.get("movieListResult")).get("movieList"))
                .stream()
                .map(movie -> (String) movie.get("movieCd"))
                .collect(Collectors.toList());
        System.out.println("code : " + movieCodes);
        // 각 movieCd에 대해 상세 정보를 요청
        List<MovieVO> movieInfoList = movieCodes.stream()
                .map(movieCd -> getMovieInfo(movieCd))
                .collect(Collectors.toList());
        System.out.println("info : " + movieInfoList);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Movies");

        // 헤더 행 생성
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("movie_code");
        headerRow.createCell(1).setCellValue("movie_kor");
        headerRow.createCell(2).setCellValue("movie_eng");
        headerRow.createCell(3).setCellValue("movie_type");
        headerRow.createCell(4).setCellValue("movie_genre");
        headerRow.createCell(5).setCellValue("movie_nation");
        headerRow.createCell(6).setCellValue("movie_actors");
        headerRow.createCell(7).setCellValue("movie_showtime");
        headerRow.createCell(8).setCellValue("opened_year");
        headerRow.createCell(9).setCellValue("movie_grade");
        headerRow.createCell(10).setCellValue("movie_directors");
        headerRow.createCell(11).setCellValue("movie_poster");
        headerRow.createCell(12).setCellValue("movie_date");
        headerRow.createCell(13).setCellValue("movie_link");

        // 데이터 행 생성
        int rowNum = 1;
        for (MovieVO movie : movieInfoList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(movie.getMovie_code());
            row.createCell(1).setCellValue(movie.getMovie_kor());
            row.createCell(2).setCellValue(movie.getMovie_eng());
            row.createCell(3).setCellValue(movie.getMovie_type());
            row.createCell(4).setCellValue(movie.getMovie_genre());
            row.createCell(5).setCellValue(movie.getMovie_nation());
            row.createCell(6).setCellValue(movie.getMovie_actors());
            row.createCell(7).setCellValue(movie.getMovie_showtime());
            row.createCell(8).setCellValue(movie.getOpened_year());
            row.createCell(9).setCellValue(movie.getMovie_grade());
            row.createCell(10).setCellValue(movie.getMovie_directors());
            row.createCell(11).setCellValue(movie.getMovie_poster());
            row.createCell(13).setCellValue(movie.getMovie_link());
        }
//        try (FileOutputStream fos = new FileOutputStream("POI-write.xlsx")) {
//            workbook.write(fos);
//        } catch (Exception e) {
//            e.printStackTrace();
//        } finally {
//            try {
//                //workbook.close();
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }

        // Excel 파일을 ByteArray로 변환
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            workbook.write(out);
            workbook.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // HTTP 응답으로 Excel 파일을 전송
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "movies.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(out.toByteArray());
        //return ResponseEntity.ok(movieInfoList);
    }

    private MovieVO getMovieInfo(String movieCd) {

        String apiDetail = "http://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key="+apikey+"&movieCd=" + movieCd;
        // JSON 응답을 Map으로 직접 변환
        Map<String, Object> response = restTemplate.getForObject(apiDetail, Map.class);
        Map<String, Object> movieInfo = (Map<String, Object>) ((Map<String, Object>) response.get("movieInfoResult")).get("movieInfo");

        // Map에서 필요한 데이터 추출
        MovieVO movie = new MovieVO();
        movie.setMovie_code((String) movieInfo.get("movieCd"));
        movie.setMovie_kor((String) movieInfo.get("movieNm"));
        movie.setMovie_eng((String) movieInfo.get("movieNmEn"));
        movie.setMovie_type((String) movieInfo.get("typeNm"));
        List<Map<String, Object>> genres = (List<Map<String, Object>>) movieInfo.get("genres");
        if (genres != null && !genres.isEmpty()) {
            movie.setMovie_genre((String) genres.get(0).get("genreNm")); // 첫 번째 항목의 genreNm에 접근
        }
        List<Map<String, Object>> nation = (List<Map<String, Object>>) movieInfo.get("nations");
        if (nation != null && !nation.isEmpty()) {
            movie.setMovie_nation((String) nation.get(0).get("nationNm")); // 첫 번째 항목의 genreNm에 접근
        }
        List<Map<String, Object>> actors = (List<Map<String, Object>>) movieInfo.get("actors");
//        System.out.println(actors.toString());
        String actorString = "";
        for (int i = 0; i < 5 && i < actors.size(); i++) {
            if (i > 0) {
                actorString += "/"; // 이전 배우와 구분을 위한 구분자 추가
            }
            actorString += ((String) actors.get(i).get("peopleNm"));
//            System.out.println(actorString);
        }
        movie.setMovie_actors(actorString);
        movie.setMovie_showtime((String) movieInfo.get("showTm"));
        movie.setOpened_year((String) movieInfo.get("openDt"));
        List<Map<String, Object>> audits = (List<Map<String, Object>>) movieInfo.get("audits");
        if (audits != null && !audits.isEmpty()) {// 영화 등급
            movie.setMovie_grade((String) audits.get(0).get("watchGradeNm")); // 첫 번째 항목의 genreNm에 접근
        }
        List<Map<String, Object>> directors = (List<Map<String, Object>>) movieInfo.get("directors");
        if (directors != null && !directors.isEmpty()) { // 영화 감독
            movie.setMovie_directors((String) directors.get(0).get("peopleNm")); // 첫 번째 항목의 genreNm에 접근
        }
        movie.setMovie_poster(""); // 포스터 URL
        movie.setMovie_link(""); // 영화 링크

        movie.setMovie_code((String) movieInfo.get("movieCd"));
        movie.setMovie_kor((String) movieInfo.get("movieNm"));
        movie.setMovie_eng((String) movieInfo.get("movieNmEn"));
        movie.setMovie_type((String) movieInfo.get("typeNm"));
        movie.setMovie_showtime((String) movieInfo.get("showTm"));
        movie.setOpened_year((String) movieInfo.get("openDt"));

//        movie.setActor(actorString); // 최종 결과를 movie 객체에 설정
//        System.out.println(movie.getActor());
        // 여기서 디비에 넣기

        return movie;
    }
}
