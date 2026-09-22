package com.team39.authenticatedbackend.models;

public class RegistrationDTO {

    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Integer departmentID;
    private String passwordResetEmail;
    private String newPassword;



    public RegistrationDTO(){
        super();
    }

    public RegistrationDTO(String username, String password, String firstName, String lastName,
                           String phoneNumber, Integer departmentID, String passwordResetEmail, String newPassword
                           ){
        super();
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.departmentID = departmentID;
        this.passwordResetEmail = passwordResetEmail;
        this.newPassword = newPassword;
    }
    public Integer getDepartmentID() {
        return departmentID;
    }
    public void setDepartmentID(Integer departmentID) {
        this.departmentID = departmentID;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getUsername(){
        return this.username;
    }
    public void setUsername(String username){
        this.username = username;
    }
    public String getPassword(){
        return this.password;
    }
    public void setPassword(String password) {
        this.password = password;
    }


    public String getPasswordResetEmail() {
        return passwordResetEmail;
    }
    public void setPasswordResetEmail(String passwordResetEmail) {
        this.passwordResetEmail = passwordResetEmail;
    }
    public String getNewPassword() {
        return newPassword;
    }
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }


}
