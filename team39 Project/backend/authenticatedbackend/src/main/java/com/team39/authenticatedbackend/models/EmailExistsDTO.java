package com.team39.authenticatedbackend.models;

public class EmailExistsDTO {
    private boolean emailExists;

    public EmailExistsDTO(boolean emailExists) {
        this.emailExists = emailExists;
    }

    public boolean isEmailExists() {
        return emailExists;
    }

    public void setEmailExists(boolean emailExists) {
        this.emailExists = emailExists;
    }
}
