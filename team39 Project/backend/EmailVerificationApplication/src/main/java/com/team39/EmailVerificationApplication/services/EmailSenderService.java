package com.team39.EmailVerificationApplication.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {


    @Value("${email.verification.subject}")
    private String verificationSubject;

    @Value("${email.verification.body}")
    private String verificationBody;

    @Value("${email.verification.sender}")
    private String verificationSender;


    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String toEmail,
                          String emailToken
    ){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(verificationSender); //sender email
        message.setTo(toEmail);
        message.setSubject(verificationSubject);

        String body = verificationBody.replace("{0}", emailToken);
        message.setText(body);
        mailSender.send(message);
    }





}
