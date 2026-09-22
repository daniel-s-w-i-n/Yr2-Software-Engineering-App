package com.team39.EmailVerificationApplication.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"emailVerificationTable\"")
public class ApplicationUser {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "emailToken_id_seq")
    @SequenceGenerator(name = "emailToken_id_seq", sequenceName = "emailVerificationTable__emailTokenID_seq", allocationSize = 1)
    @Column(name = "\"emailTokenID\"")
    private Integer emailTokenID;

    @Column(name = "email")
    private String email;

    @Column(name = "\"emailToken\"")
    private String emailToken;

    @Column(name = "\"emailTokenExpiry\"")
    private LocalDateTime emailTokenExpiry;

    @Column(name = "\"verified\"")
    private Boolean verified;


    public ApplicationUser(Integer emailTokenID, String email,
                           String emailToken, LocalDateTime emailTokenExpiry,
                           Boolean verified) {

        this.emailTokenID = emailTokenID;
        this.email = email;
        this.emailToken = emailToken;
        this.emailTokenExpiry = emailTokenExpiry;
        this.verified = verified;
    }

    public ApplicationUser() {

    }


    public Integer getEmailTokenID() {
        return emailTokenID;
    }

    public void setEmailTokenID(Integer emailTokenID) {
        this.emailTokenID = emailTokenID;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmailToken() {
        return emailToken;
    }

    public void setEmailToken(String emailToken) {
        this.emailToken = emailToken;
    }

    public LocalDateTime getEmailTokenExpiry() {
        return emailTokenExpiry;
    }

    public void setEmailTokenExpiry(LocalDateTime emailTokenExpiry) {
        this.emailTokenExpiry = emailTokenExpiry;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}
