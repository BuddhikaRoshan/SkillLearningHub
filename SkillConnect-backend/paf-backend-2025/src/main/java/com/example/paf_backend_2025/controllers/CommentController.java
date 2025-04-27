package com.example.paf_backend_2025.controllers;

import com.example.paf_backend_2025.dtos.MediaTypeDTO;
import com.example.paf_backend_2025.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<MediaTypeDTO.CommentResponseDTO>> getCommentsByPost(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MediaTypeDTO.CommentResponseDTO>> getCommentsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(commentService.getCommentsByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaTypeDTO.CommentResponseDTO> getCommentById(@PathVariable String id) {
        return commentService.getCommentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MediaTypeDTO.CommentResponseDTO> createComment(@RequestBody MediaTypeDTO.CommentDTO commentDTO) {
        return ResponseEntity.ok(commentService.createComment(commentDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaTypeDTO.CommentResponseDTO> updateComment(
            @PathVariable String id,
            @RequestBody MediaTypeDTO.CommentDTO commentDTO) {
        return commentService.updateComment(id, commentDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        if (commentService.deleteComment(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}