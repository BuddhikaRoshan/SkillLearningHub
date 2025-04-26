package com.example.pafbackend.controllers;

import com.example.pafbackend.dtos.AppUserDTO;
import com.example.pafbackend.dtos.LoginDTO;
import com.example.pafbackend.dtos.UserProfileDTO;
import com.example.pafbackend.models.AppUser;
import com.example.pafbackend.services.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class AppUserController {

    @Autowired
    private AppUserService appUserService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUserDTO appUserDTO) {
        try {
            return ResponseEntity.ok(appUserService.createUser(appUserDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @GetMapping
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        return ResponseEntity.ok(appUserService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserById(@PathVariable String id) {
        Optional<UserProfileDTO> user = appUserService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileDTO> updateUser(@PathVariable String id, @RequestBody AppUserDTO appUserDTO) {
        Optional<UserProfileDTO> updatedUser = appUserService.updateUser(id, appUserDTO);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        if (appUserService.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}