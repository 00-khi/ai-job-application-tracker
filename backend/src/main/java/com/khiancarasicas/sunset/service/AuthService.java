package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.dto.AuthResponse;
import com.khiancarasicas.sunset.model.dto.LoginRequest;
import com.khiancarasicas.sunset.model.dto.RegisterRequest;
import com.khiancarasicas.sunset.model.entity.User;
import com.khiancarasicas.sunset.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthResponse register(RegisterRequest request) {

    String email = request.email()
        .trim()
        .toLowerCase();

    if (userRepository.existsByEmail(email)) {
      throw new IllegalStateException("Email is already registered");
    }

    User user = new User();

    user.setEmail(email);
    user.setPassword(
        passwordEncoder.encode(request.password()));

    User savedUser = userRepository.save(user);

    String token = jwtService.generateToken(savedUser);

    return new AuthResponse(token);
  }

  public AuthResponse login(LoginRequest request) {

    String email = request.email()
        .trim()
        .toLowerCase();

    User user = userRepository
        .findByEmail(email)
        .orElseThrow(() -> new SecurityException("Invalid email or password"));

    if (!passwordEncoder.matches(
        request.password(),
        user.getPassword())) {
      throw new SecurityException("Invalid email or password");
    }

    String token = jwtService.generateToken(user);

    return new AuthResponse(token);
  }
}