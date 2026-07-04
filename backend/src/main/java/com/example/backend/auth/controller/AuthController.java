package com.example.backend.auth.controller;

import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.UserResponse;
import com.example.backend.auth.service.AuthService;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // TODO: Spring Security導入後に削除
    private final UserRepository userRepository;

    private User currentUser() {
        return userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("テスト用ユーザーが存在しません"));
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody @Valid RegisterRequest request) {
        return authService.register(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        // TODO: Spring Security導入後は @AuthenticationPrincipal User user を引数で受け取る
        return authService.getMe(currentUser());
    }
}
