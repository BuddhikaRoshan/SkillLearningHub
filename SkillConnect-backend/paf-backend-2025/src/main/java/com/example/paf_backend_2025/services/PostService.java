package com.example.paf_backend_2025.services;

import com.example.paf_backend_2025.dtos.PostDTO;
import com.example.paf_backend_2025.dtos.PostResponseDTO;
import com.example.paf_backend_2025.models.*;
import com.example.paf_backend_2025.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final AppUserRepository appUserRepository;
    private final MediaTypeRepository mediaTypeRepository;

    @Autowired
    public PostService(PostRepository postRepository,
                       AppUserRepository appUserRepository,
                       MediaTypeRepository mediaTypeRepository) {
        this.postRepository = postRepository;
        this.appUserRepository = appUserRepository;
        this.mediaTypeRepository = mediaTypeRepository;
    }

    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findByDeleteStatusFalse().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<PostResponseDTO> getPostById(String id) {
        return postRepository.findByIdAndDeleteStatusFalse(id)
                .map(this::convertToDTO);
    }

    public PostResponseDTO createPost(PostDTO postDTO) {
        Post post = new Post();
        post.setCaption(postDTO.getCaption());


        // Set user
        AppUser user = appUserRepository.findById(postDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);

        // Set media types
        if (postDTO.getMediaTypeIds() != null) {
            List<MediaType> mediaTypes = postDTO.getMediaTypeIds().stream()
                    .map(id -> mediaTypeRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("MediaType not found with id: " + id)))
                    .collect(Collectors.toList());
            post.setMediaTypes(mediaTypes);
        }

        // Set tagged users
        if (postDTO.getTaggedUserIds() != null) {
            List<AppUser> taggedUsers = postDTO.getTaggedUserIds().stream()
                    .map(id -> appUserRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("User not found with id: " + id)))
                    .collect(Collectors.toList());
            post.setTaggedUsers(taggedUsers);
        }

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    public Optional<PostResponseDTO> updatePost(String id, PostDTO postDTO) {
        return postRepository.findById(id)
                .map(existingPost -> {
                    if (existingPost.isDeleteStatus()) {
                        return null; // Can't update deleted post
                    }

                    existingPost.setCaption(postDTO.getCaption());
                    existingPost.setUpdatedAt(new Date());

                    // Update media types if provided
                    if (postDTO.getMediaTypeIds() != null) {
                        List<MediaType> mediaTypes = postDTO.getMediaTypeIds().stream()
                                .map(mediaId -> mediaTypeRepository.findById(mediaId)
                                        .orElseThrow(() -> new RuntimeException("MediaType not found")))
                                .collect(Collectors.toList());
                        existingPost.setMediaTypes(mediaTypes);
                    }

                    // Update tagged users if provided
                    if (postDTO.getTaggedUserIds() != null) {
                        List<AppUser> taggedUsers = postDTO.getTaggedUserIds().stream()
                                .map(userId -> appUserRepository.findById(userId)
                                        .orElseThrow(() -> new RuntimeException("User not found")))
                                .collect(Collectors.toList());
                        existingPost.setTaggedUsers(taggedUsers);
                    }

                    Post updatedPost = postRepository.save(existingPost);
                    return convertToDTO(updatedPost);
                });
    }

    public boolean deletePost(String id) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setDeleteStatus(true);
                    post.setUpdatedAt(new Date());
                    postRepository.save(post);
                    return true;
                })
                .orElse(false);
    }

    public List<PostResponseDTO> getPostsByUser(String userId) {
        return postRepository.findByUserIdAndDeleteStatusFalse(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PostResponseDTO convertToDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setCaption(post.getCaption());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setUser(post.getUser());
        dto.setMediaTypes(post.getMediaTypes());
        dto.setTaggedUsers(post.getTaggedUsers());
        return dto;
    }
}