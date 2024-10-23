package com.ict.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("비밀번호 재설정 안내");

        String htmlContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "    <style>" +
                "        .email-container {" +
                "            width: 100%;" +
                "            max-width: 600px;" +
                "            margin: 0 auto;" +
                "            padding: 20px;" +
                "            font-family: Arial, sans-serif;" +
                "            background-color: #f4f4f4;" +
                "            border-radius: 8px;" +
                "        }" +
                "        .email-header {" +
                "            background-color: #4CAF50;" +
                "            padding: 10px;" +
                "            color: white;" +
                "            text-align: center;" +
                "            border-top-left-radius: 8px;" +
                "            border-top-right-radius: 8px;" +
                "        }" +
                "        .email-body {" +
                "            padding: 20px;" +
                "            background-color: white;" +
                "            border-bottom-left-radius: 8px;" +
                "            border-bottom-right-radius: 8px;" +
                "        }" +
                "        .email-body p {" +
                "            font-size: 16px;" +
                "        }" +
                "        .reset-link {" +
                "            display: inline-block;" +
                "            padding: 10px 20px;" +
                "            margin-top: 20px;" +
                "            background-color: #4CAF50;" +
                "            color: white;" +
                "            text-decoration: none;" +
                "            border-radius: 5px;" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"email-container\">" +
                "        <div class=\"email-header\">" +
                "            <h1>비밀번호 재설정 요청</h1>" +
                "        </div>" +
                "        <div class=\"email-body\">" +
                "            <p>안녕하세요,</p>" +
                "            <p>비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>" +
                "            <a href=\"" + resetLink + "\" class=\"reset-link\">비밀번호 재설정</a>" +
                "            <p>이 요청을 하지 않으셨다면, 이 이메일을 무시해 주세요.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";

        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

}
