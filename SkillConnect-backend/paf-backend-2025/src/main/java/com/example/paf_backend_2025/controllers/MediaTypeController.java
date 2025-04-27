package com.example.paf_backend_2025.controllers;

import com.example.paf_backend_2025.dtos.MediaTypeDTO;
import com.example.paf_backend_2025.dtos.MediaTypeResponseDTO;
import com.example.paf_backend_2025.services.MediaTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media-types")
public class MediaTypeController {

    private final MediaTypeService mediaTypeService;

    @Autowired
    public MediaTypeController(MediaTypeService mediaTypeService) {
        this.mediaTypeService = mediaTypeService;
    }

    @GetMapping
    public ResponseEntity<List<MediaTypeResponseDTO>> getAllMediaTypes() {
        return ResponseEntity.ok(mediaTypeService.getAllMediaTypes());
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<MediaTypeResponseDTO>> getMediaTypesByPost(@PathVariable String postId) {
        return ResponseEntity.ok(mediaTypeService.getMediaTypesByPost(postId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaTypeResponseDTO> getMediaTypeById(@PathVariable String id) {
        return mediaTypeService.getMediaTypeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MediaTypeResponseDTO> createMediaType(@RequestBody MediaTypeDTO mediaTypeDTO) {
        return ResponseEntity.ok(mediaTypeService.createMediaType(mediaTypeDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MediaTypeResponseDTO> updateMediaType(
            @PathVariable String id,
            @RequestBody MediaTypeDTO mediaTypeDTO) {
        return mediaTypeService.updateMediaType(id, mediaTypeDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMediaType(@PathVariable String id) {
        if (mediaTypeService.deleteMediaType(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}