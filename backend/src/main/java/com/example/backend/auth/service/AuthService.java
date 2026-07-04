package com.example.backend.auth.service;

import com.example.backend.auth.dto.RegisterRequest;
import com.example.backend.auth.dto.UserResponse;
import com.example.backend.common.exception.ConflictException;
import com.example.backend.user.entity.User;
import com.example.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("このユーザー名はすでに使われています");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("このメールアドレスはすでに登録されています");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        return modelMapper.map(userRepository.save(user), UserResponse.class);
    }

    public UserResponse getMe(User user) {
        return modelMapper.map(user, UserResponse.class);
    }
}
