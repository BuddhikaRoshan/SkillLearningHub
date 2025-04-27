
package com.example.paf_backend_2025.controllers;

import com.example.paf_backend_2025.dtos.CreateLearningProgressUpdateDTO;
import com.example.paf_backend_2025.dtos.LearningProgressUpdateDTO;
import com.example.paf_backend_2025.dtos.PublicStatusRequest;
import com.example.paf_backend_2025.dtos.UpdateLearningProgressUpdateDTO;
import com.example.paf_backend_2025.models.LearningProgressUpdate;
import com.example.paf_backend_2025.services.LearningProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress-updates")
public class LearningProgressUpdateController {

    private final LearningProgressUpdateService progressService;

    @Autowired
    public LearningProgressUpdateController(LearningProgressUpdateService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ResponseEntity<List<LearningProgressUpdateDTO>> getAllProgressUpdates() {
        List<LearningProgressUpdateDTO> updates = progressService.getAllProgressUpdates();
        return new ResponseEntity<>(updates, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgressUpdateDTO>> getProgressUpdatesByUserId(@PathVariable String userId) {
        List<LearningProgressUpdateDTO> updates = progressService.getProgressUpdatesByUserId(userId);
        return new ResponseEntity<>(updates, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningProgressUpdateDTO> getProgressUpdateById(@PathVariable String id) {
        LearningProgressUpdateDTO update = progressService.getProgressUpdateById(id);
        return new ResponseEntity<>(update, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<LearningProgressUpdateDTO> createProgressUpdate(
            @RequestBody CreateLearningProgressUpdateDTO createDTO) {
        LearningProgressUpdateDTO createdUpdate = progressService.createProgressUpdate(createDTO);
        return new ResponseEntity<>(createdUpdate, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningProgressUpdateDTO> updateProgressUpdate(
            @PathVariable String id,
            @RequestBody UpdateLearningProgressUpdateDTO updateDTO) {
        LearningProgressUpdateDTO updatedUpdate = progressService.updateProgressUpdate(id, updateDTO);
        return new ResponseEntity<>(updatedUpdate, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgressUpdate(@PathVariable String id) {
        progressService.deleteProgressUpdate(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updatePublicStatus(@PathVariable String id, @RequestBody PublicStatusRequest request) {
        Optional<LearningProgressUpdate> updated = progressService.updatePublicStatus(id, request.isPublic());

        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}