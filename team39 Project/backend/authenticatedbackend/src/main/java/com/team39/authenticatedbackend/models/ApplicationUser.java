package com.team39.authenticatedbackend.models;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "\"employeeTable\"")
public class ApplicationUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_id_seq")
    @SequenceGenerator(name = "employee_id_seq", sequenceName = "employeeTable_employeeID_seq", allocationSize = 1)
    @Column(name = "\"employeeID\"")
    private Integer userId;
    @Column(name = "email",unique = true)
    private String username;
    private String password;
    @Column(name = "\"firstName\"")
    private String firstName;
    @Column(name = "\"lastName\"")
    private String lastName;
    @Column(name = "\"phoneNumber\"")
    private String phoneNumber;
    @Column(name = "\"departmentID\"")
    private Integer departmentID;


    @ManyToMany(fetch = FetchType.EAGER)
    // fetch the data for the authorities as soon as the user information is fetched
    // Many to many as many users can have many roles,
    // or many roles can have many users


    //Join table joins the user table and role tableem
    @JoinTable(
            name = "\"employeeAccessJunction\"",
            joinColumns = {@JoinColumn(name = "\"employeeID\"")},
            inverseJoinColumns = {@JoinColumn(name = "\"accessTypeID\"")}
    )

    private Set<Role> authorities;

    public ApplicationUser(){
        super();
        this.authorities = new HashSet<Role>();
    }

    public ApplicationUser(Integer userId, String username, String password, Set<Role> authorities,
                           String firstName, String lastName, String phoneNumber, Integer departmentID

    ){
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.departmentID = departmentID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getDepartmentID() {
        return departmentID;
    }

    public void setDepartmentID(Integer departmentID) {
        this.departmentID = departmentID;
    }

    public Integer getUserId(){
        return this.userId;
    }
    public void setUserId(Integer userId){
        this.userId = userId; }



    @Override
    public String getPassword() {
        return this.password;
    }
    public void setPassword(String password){
        this.password = password;
    }
    @Override
    public String getUsername() {
        return this.username;
    }
    public void setUsername(String username){
        this.username = username;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }
    public void setAuthorities(Set<Role> authorities){
        this.authorities = authorities;
    }


    @Override
    public boolean isAccountNonExpired() {
        return true; //indicates account is usable
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; //indicates account is usable
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // can set up logic for this if needed
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
