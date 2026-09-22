package com.team39.EmailVerificationApplication.controllers;

import com.team39.EmailVerificationApplication.models.EmailTokenDTO;
import com.team39.EmailVerificationApplication.models.EmailVerifyDTO;
import com.team39.EmailVerificationApplication.services.EmailSenderService;
import com.team39.EmailVerificationApplication.services.EmailTokenSaveService;
import com.team39.EmailVerificationApplication.services.EmailVerifyService;
import com.team39.EmailVerificationApplication.utils.EmailTokenGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController // allows mapping of endpoints to server
@RequestMapping("/auth")// allows this controller to be mapped to a specific endpoint
@CrossOrigin("*")

public class EmailTokenController {




    @Autowired
    private EmailTokenSaveService emailTokenSaveService;

    @Autowired
    private EmailTokenGenerator emailTokenGenerator;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private EmailVerifyService emailVerifyService;



    @PostMapping("/saveEmailToken")
    public ResponseEntity<Void> sendEmail (@RequestBody EmailTokenDTO body){


        String emailToken = emailTokenGenerator.generateToken(6);
        LocalDateTime emailTokenExpiryDate = emailTokenGenerator.generateTokenExpiry();


        emailTokenSaveService.saveEmailToken (
                body.getEmail(),
                emailToken,
                emailTokenExpiryDate
                );

        emailSenderService.sendEmail(body.getEmail(), emailToken);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/verifyEmailToken")
    public EmailVerifyDTO verifyEmailToken(@RequestBody EmailTokenDTO body){

        return emailVerifyService.verifyEmail(body.getEmail(), body.getEmailToken());

    }












}
