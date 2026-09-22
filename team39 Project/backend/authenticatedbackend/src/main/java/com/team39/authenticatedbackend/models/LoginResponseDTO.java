package com.team39.authenticatedbackend.models;

public class LoginResponseDTO {
    private String jwt;

    public LoginResponseDTO(String jwt){
        this.jwt = jwt;
    }

    public String getJwt() {
        return this.jwt;
    }
    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

}
