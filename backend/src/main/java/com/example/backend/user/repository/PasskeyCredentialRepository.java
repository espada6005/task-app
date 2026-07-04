package com.example.backend.user.repository;

import com.example.backend.user.entity.PasskeyCredential;
import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PasskeyCredentialRepository extends JpaRepository<PasskeyCredential, Long> {

    List<PasskeyCredential> findByUser(User user);

    Optional<PasskeyCredential> findByCredentialId(String credentialId);

    void deleteByUser(User user);
}
