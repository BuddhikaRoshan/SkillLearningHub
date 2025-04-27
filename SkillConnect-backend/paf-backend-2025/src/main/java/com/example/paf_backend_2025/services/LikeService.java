package com.example.paf_backend_2025.services;

import com.example.paf_backend_2025.dtos.LikeDTO;
import com.example.paf_backend_2025.dtos.LikeResponseDTO;
import com.example.paf_backend_2025.dtos.NotificationDTO;
import com.example.paf_backend_2025.models.*;
import com.example.paf_backend_2025.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final AppUserRepository appUserRepository;
    private final PostRepository postRepository;

    private final NotificationService notificationService;

    @Autowired
    public LikeService(LikeRepository likeRepository,
                       AppUserRepository appUserRepository,
                       PostRepository postRepository,NotificationService notificationService) {
        this.likeRepository = likeRepository;
        this.appUserRepository = appUserRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public List<LikeResponseDTO> getLikesByPost(String postId) {
        return likeRepository.findByPostId(postId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LikeResponseDTO> getLikesByUser(String userId) {
        return likeRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LikeResponseDTO createLike(LikeDTO likeDTO) {
        // Check if like already exists
        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(
                likeDTO.getUserId(),
                likeDTO.getPostId()
        );

        if (existingLike.isPresent()) {
            return convertToDTO(existingLike.get());
        }

        Like like = new Like();

        AppUser user = appUserRepository.findById(likeDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        like.setUser(user);

        Post post = postRepository.findById(likeDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        like.setPost(post);

        Like savedLike = likeRepository.save(like);

        notificationService.createNotification(
                post.getUser().getId(),
                "You have a new like for your post",
                like.getUser().getFirstName() + " has liked to your post"
        );
        return convertToDTO(savedLike);
    }

    public boolean deleteLike(String likeId) {
        Optional<Like> like = likeRepository.findById(likeId);
        if (like.isPresent()) {
            likeRepository.deleteById(likeId);
            return true;
        }
        return false;
    }

    public boolean hasUserLikedPost(String userId, String postId) {
        return likeRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }

    private LikeResponseDTO convertToDTO(Like like) {
        LikeResponseDTO dto = new LikeResponseDTO();
        dto.setId(like.getId());
        dto.setCreatedAt(like.getCreatedAt());
        dto.setUser(like.getUser());
        dto.setPost(like.getPost());
        return dto;
    }
}