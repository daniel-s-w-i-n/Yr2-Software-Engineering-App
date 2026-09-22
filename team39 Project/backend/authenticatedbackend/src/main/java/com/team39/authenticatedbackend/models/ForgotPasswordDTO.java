package com.team39.authenticatedbackend.models;

public class ForgotPasswordDTO {

    private String jwt;

    public ForgotPasswordDTO(String jwt){
        this.jwt = jwt;
    }

    public String getJwt() {
        return this.jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}