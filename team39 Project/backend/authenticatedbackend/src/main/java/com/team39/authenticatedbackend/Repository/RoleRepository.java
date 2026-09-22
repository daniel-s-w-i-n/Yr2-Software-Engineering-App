package com.team39.authenticatedbackend.repository;

import com.team39.authenticatedbackend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
//Via spring JpaRepository, allows queries to search for Role by role authority
public interface RoleRepository extends JpaRepository<Role, Integer> {



    Optional<Role> findByAuthority(String authority);
}
