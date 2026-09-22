package com.team39.authenticatedbackend.models;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
@Entity
@Table(name="\"accessTable\"")
public class Role implements GrantedAuthority {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"accessTypeID\"")
    private Integer roleID;


    @Column(name = "\"levOfAccess\"")
    private String authority;

    public Role(){
        super();
    }

    public Role(String authority){
        this.authority = authority;
    }


    public Role(Integer roleID, String authority){

        this.roleID = roleID;
        this.authority = authority;
    }


    @Override
    public String getAuthority() {
        return this.authority;
    }

    public void setAuthority(String authority){
        this.authority = authority;
    }

    public Integer getRoleID(){
        return this.roleID;
    }

    public void setRoleID(Integer roleId){
        this.roleID = roleId;
    }

}
