package com.example.backend.user.repository;

import com.example.backend.user.entity.BackupCode;
import com.example.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BackupCodeRepository extends JpaRepository<BackupCode, Long> {

    List<BackupCode> findByUserAndUsedFalse(User user);

    Optional<BackupCode> findByUserAndCodeHash(User user, String codeHash);

    void deleteByUser(User user);
}
