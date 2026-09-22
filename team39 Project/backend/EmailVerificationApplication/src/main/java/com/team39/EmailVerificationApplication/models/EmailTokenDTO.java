package com.team39.EmailVerificationApplication.models;

import java.time.LocalDateTime;
public class EmailTokenDTO {

    private String email;
    private String emailToken;


    public EmailTokenDTO(){
        super();
    }

    public EmailTokenDTO(String email, String emailToken, LocalDateTime emailTokenExpiry) {
        super();

        this.email = email;
        this.emailToken = emailToken;
    }

    public String getEmailToken() {
        return emailToken;
    }
    public void setEmailToken(String emailToken) {
        this.emailToken = emailToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
