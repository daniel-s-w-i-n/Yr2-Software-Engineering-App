package com.team39.EmailVerificationApplication.models;

public class EmailVerifyDTO {


    private Boolean verified;

    public EmailVerifyDTO(Boolean verified) {
        this.verified = verified;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
