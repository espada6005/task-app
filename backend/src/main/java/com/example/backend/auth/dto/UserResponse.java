package com.example.backend.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// ModelMapperによるフィールドマッピングのため可変オブジェクト
@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private boolean totpEnabled;
    private LocalDateTime createdAt;
}
