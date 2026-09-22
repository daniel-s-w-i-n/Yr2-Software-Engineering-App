package com.team39.EmailVerificationApplication.repository;

import com.team39.EmailVerificationApplication.models.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;



@Repository
public interface UserRepository  extends JpaRepository<ApplicationUser, Integer> {
    Optional<ApplicationUser> findByEmail(String email);
    Optional<ApplicationUser> findByEmailToken(String emailToken);

    @Query("SELECT u.emailTokenExpiry FROM ApplicationUser u WHERE u.email = :email")
    LocalDateTime findEmailTokenExpiryByEmail(@Param("email") String email);

    @Query("SELECT u.emailToken FROM ApplicationUser u WHERE u.email = :email")
    String findEmailTokenInDatabase(@Param("email") String email);

    @Query("SELECT u.verified FROM ApplicationUser u WHERE u.email = :email")
    Boolean findEmailTokenVerified(@Param("email") String email);


    @Transactional
    @Modifying
    @Query("UPDATE ApplicationUser u SET u.verified = true WHERE u.email = :email AND u.emailToken = :emailToken")
    void updateVerificationStatus(@Param("email") String email, @Param("emailToken") String emailToken);


}



