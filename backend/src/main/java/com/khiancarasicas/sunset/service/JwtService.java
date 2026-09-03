package com.khiancarasicas.sunset.service;

import com.khiancarasicas.sunset.model.entity.User;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Service
public class JwtService {

  private final JwtEncoder jwtEncoder;

  public JwtService(@Value("${jwt.secret}") String secret) {

    SecretKey key = new SecretKeySpec(
        secret.getBytes(StandardCharsets.UTF_8),
        "HmacSHA256");

    this.jwtEncoder = new NimbusJwtEncoder(
        new ImmutableSecret<>(key));
  }

  public String generateToken(User user) {

    Instant now = Instant.now();
    Instant expiration = now.plusSeconds(86400);

    JwtClaimsSet claims = JwtClaimsSet.builder()
        .subject(user.getId().toString())
        .claim("email", user.getEmail())
        .issuedAt(now)
        .expiresAt(expiration)
        .build();

    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256)
        .build();

    JwtEncoderParameters parameters = JwtEncoderParameters.from(header, claims);

    return jwtEncoder
        .encode(parameters)
        .getTokenValue();
  }
}