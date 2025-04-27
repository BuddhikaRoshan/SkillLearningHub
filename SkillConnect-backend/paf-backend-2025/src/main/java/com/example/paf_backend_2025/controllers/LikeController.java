package com.example.paf_backend_2025.controllers;

import com.example.paf_backend_2025.dtos.LikeDTO;
import com.example.paf_backend_2025.dtos.LikeResponseDTO;
import com.example.paf_backend_2025.services.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<LikeResponseDTO>> getLikesByPost(@PathVariable String postId) {
        return ResponseEntity.ok(likeService.getLikesByPost(postId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LikeResponseDTO>> getLikesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(likeService.getLikesByUser(userId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserLikedPost(
            @RequestParam String userId,
            @RequestParam String postId) {
        return ResponseEntity.ok(likeService.hasUserLikedPost(userId, postId));
    }

    @PostMapping
    public ResponseEntity<LikeResponseDTO> createLike(@RequestBody LikeDTO likeDTO) {
        return ResponseEntity.ok(likeService.createLike(likeDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLike(
            @PathVariable String id) {
        if (likeService.deleteLike(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}