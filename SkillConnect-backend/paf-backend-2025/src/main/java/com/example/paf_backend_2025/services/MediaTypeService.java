package com.example.paf_backend_2025.services;

import com.example.paf_backend_2025.dtos.MediaTypeDTO;
import com.example.paf_backend_2025.dtos.MediaTypeResponseDTO;
import com.example.paf_backend_2025.models.MediaType;
import com.example.paf_backend_2025.models.Post;
import com.example.paf_backend_2025.repositories.MediaTypeRepository;
import com.example.paf_backend_2025.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MediaTypeService {

    private final MediaTypeRepository mediaTypeRepository;
    private final PostRepository postRepository;

    @Autowired
    public MediaTypeService(MediaTypeRepository mediaTypeRepository,
                            PostRepository postRepository) {
        this.mediaTypeRepository = mediaTypeRepository;
        this.postRepository = postRepository;
    }

    public List<MediaTypeResponseDTO> getAllMediaTypes() {
        return mediaTypeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MediaTypeResponseDTO> getMediaTypesByPost(String postId) {
        return mediaTypeRepository.findAll().stream()
                .filter(mediaType -> postId.equals(mediaType.getPostId()))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<MediaTypeResponseDTO> getMediaTypeById(String id) {
        return mediaTypeRepository.findById(id)
                .map(this::convertToDTO);
    }

    public MediaTypeResponseDTO createMediaType(MediaTypeDTO mediaTypeDTO) {
        MediaType mediaType = new MediaType();
        mediaType.setType(mediaTypeDTO.getType());
        mediaType.setUrl(mediaTypeDTO.getUrl());
        mediaType.setPostId(mediaType.getPostId());

        // Set post reference
        Post post = postRepository.findById(mediaTypeDTO.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));




        MediaType savedMediaType = mediaTypeRepository.save(mediaType);
        return convertToDTO(savedMediaType);
    }

    public Optional<MediaTypeResponseDTO> updateMediaType(String id, MediaTypeDTO mediaTypeDTO) {
        return mediaTypeRepository.findById(id)
                .map(existingMediaType -> {
                    existingMediaType.setType(mediaTypeDTO.getType());
                    existingMediaType.setUrl(mediaTypeDTO.getUrl());



                    MediaType updatedMediaType = mediaTypeRepository.save(existingMediaType);
                    return convertToDTO(updatedMediaType);
                });
    }

    public boolean deleteMediaType(String id) {
        if (mediaTypeRepository.existsById(id)) {
            mediaTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private MediaTypeResponseDTO convertToDTO(MediaType mediaType) {
        MediaTypeResponseDTO dto = new MediaTypeResponseDTO();
        dto.setId(mediaType.getId());
        dto.setType(mediaType.getType());
        dto.setUrl(mediaType.getUrl());
        dto.setPostId(mediaType.getPostId());
        return dto;
    }
}