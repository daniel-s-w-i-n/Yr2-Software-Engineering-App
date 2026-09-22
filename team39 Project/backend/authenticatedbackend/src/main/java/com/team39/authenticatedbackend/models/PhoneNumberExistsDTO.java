package com.team39.authenticatedbackend.models;

public class PhoneNumberExistsDTO {

    private boolean phoneNumberExists;

    public PhoneNumberExistsDTO(boolean phoneNumberExists) {
        this.phoneNumberExists = phoneNumberExists;
    }

    public boolean isPhoneNumberExists() {
        return phoneNumberExists;
    }

    public void setPhoneNumberExists(boolean phoneNumberExists) {
        this.phoneNumberExists = phoneNumberExists;
    }
}
