package com.example.HospitalManagementSystem.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
public class JwtUtil {


    private static final String SECRET =
            "This-is-my-secret-key-for-the-project";

    private final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes());


    private long EXPIRATION = 1000*60*60;

    public String generateToken(String username,List<String> roles){

        return Jwts.builder()
                .setSubject(username)
                .addClaims(Map.of("roles",roles))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION) )
                .signWith(key,SignatureAlgorithm.HS256)
                .compact();

    }

    public List<String> extractRoles(String token){
        return (List<String>) Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("roles");

    }

    public String extractUsername(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token){
        try{
            extractUsername(token);
            System.out.println("Token is valid");
            return true;
        }
        catch (JwtException e){
            System.out.println("Expired token");
            return false;
        }

    }
}
