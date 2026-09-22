package com.team39.authenticatedbackend.repository;

import com.team39.authenticatedbackend.models.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


//Via spring JpaRepository, allows queries to search for username
@Repository
public interface UserRepository  extends JpaRepository<ApplicationUser, Integer> {
    Optional<ApplicationUser> findByUsername(String username); //will search the database for username (email)
    Optional<ApplicationUser> findByPhoneNumber(String phoneNumber); //will search the database for username (email)cd
}



