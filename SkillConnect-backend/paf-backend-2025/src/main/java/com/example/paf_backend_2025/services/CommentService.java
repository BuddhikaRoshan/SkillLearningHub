package com.example.paf_backend_2025.services;

import com.example.paf_backend_2025.dtos.MediaTypeDTO;
import com.example.paf_backend_2025.models.*;
import com.example.paf_backend_2025.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final AppUserRepository appUserRepository;
    private final PostRepository postRepository;

    private final NotificationService notificationService;

    @Autowired
    public CommentService(CommentRepository commentRepository,
                          AppUserRepository appUserRepository,
                          PostRepository postRepository,NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.appUserRepository = appUserRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public List<MediaTypeDTO.CommentResponseDTO> getCommentsByPost(String postId) {
        return commentRepository.findByPostIdAndDeleteStatusFalse(postId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MediaTypeDTO.CommentResponseDTO> getCommentsByUser(String userId) {
        return commentRepository.findByUserIdAndDeleteStatusFalse(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<MediaTypeDTO.CommentResponseDTO> getCommentById(String id) {
        return commentRepository.findByIdAndDeleteStatusFalse(id)
                .map(this::convertToDTO);
    }

    public MediaTypeDTO.CommentResponseDTO createComment(MediaTypeDTO.CommentDTO commentDTO) {
        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());

        AppUser user = appUserRepository.findById(commentDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        comment.setUser(user);

        Post post = postRepository.findById(commentDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        comment.setPost(post);

        Comment savedComment = commentRepository.save(comment);
        notificationService.createNotification(
                post.getUser().getId(),
                "You have a new comment for your post",
                comment.getUser().getFirstName() + " has commented to your post"
        );
        return convertToDTO(savedComment);
    }

    public Optional<MediaTypeDTO.CommentResponseDTO> updateComment(String id, MediaTypeDTO.CommentDTO commentDTO) {
        return commentRepository.findById(id)
                .map(existingComment -> {
                    if (existingComment.isDeleteStatus()) {
                        return null;
                    }

                    existingComment.setContent(commentDTO.getContent());
                    existingComment.setUpdatedAt(new Date());

                    Comment updatedComment = commentRepository.save(existingComment);
                    return convertToDTO(updatedComment);
                });
    }

    public boolean deleteComment(String id) {
        return commentRepository.findById(id)
                .map(comment -> {
                    comment.setDeleteStatus(true);
                    comment.setUpdatedAt(new Date());
                    commentRepository.save(comment);
                    return true;
                })
                .orElse(false);
    }

    private MediaTypeDTO.CommentResponseDTO convertToDTO(Comment comment) {
        MediaTypeDTO.CommentResponseDTO dto = new MediaTypeDTO.CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setUser(comment.getUser());
        dto.setPost(comment.getPost());
        return dto;
    }
}