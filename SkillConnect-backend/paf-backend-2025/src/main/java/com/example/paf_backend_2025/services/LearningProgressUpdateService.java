package com.example.paf_backend_2025.services;

import com.example.paf_backend_2025.dtos.CreateLearningProgressUpdateDTO;
import com.example.paf_backend_2025.dtos.LearningProgressUpdateDTO;
import com.example.paf_backend_2025.dtos.UpdateLearningProgressUpdateDTO;
import com.example.paf_backend_2025.dtos.UserProfileDTO;
import com.example.paf_backend_2025.models.LearningProgressUpdate;
import com.example.paf_backend_2025.models.AppUser;
import com.example.paf_backend_2025.repositories.LearningProgressUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningProgressUpdateService {

    private final LearningProgressUpdateRepository progressRepository;
    private final AppUserService appUserService;

    @Autowired
    public LearningProgressUpdateService(LearningProgressUpdateRepository progressRepository,
                                         AppUserService appUserService) {
        this.progressRepository = progressRepository;
        this.appUserService = appUserService;
    }

    public List<LearningProgressUpdateDTO> getAllProgressUpdates() {
        return progressRepository.findByDeleteStatusFalse()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<LearningProgressUpdateDTO> getProgressUpdatesByUserId(String userId) {
        return progressRepository.findByUserIdAndDeleteStatusFalse(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LearningProgressUpdateDTO getProgressUpdateById(String id) {
        LearningProgressUpdate progress = progressRepository.findByIdAndDeleteStatusFalse(id);
        return convertToDTO(progress);
    }

    public LearningProgressUpdateDTO createProgressUpdate(CreateLearningProgressUpdateDTO createDTO) {
        Optional<UserProfileDTO> user = appUserService.getUserById(createDTO.getUserId());

        AppUser appUser = new AppUser();

        if (user.isPresent()) {
            UserProfileDTO userDTO = user.get();
            appUser.setId(userDTO.getId());
            appUser.setFirstName(userDTO.getFirstName());
            appUser.setLastName(userDTO.getLastName());
            appUser.setBio(userDTO.getBio());
            appUser.setProfileImageUrl(userDTO.getProfileImageUrl());
            appUser.setUsername(userDTO.getUsername());
            appUser.setEmail(userDTO.getEmail());
            appUser.setContactNumber(userDTO.getContactNumber());
            appUser.setPublicStatus(userDTO.isPublicStatus());
            appUser.setCreatedAt(userDTO.getCreatedAt());
        }

        LearningProgressUpdate progress = new LearningProgressUpdate();
        progress.setContent(createDTO.getContent());
        progress.setTemplateType(createDTO.getTemplateType());
        progress.setCompletedProgress(createDTO.getCompletedProgress());
        progress.setUser(appUser);
        progress.setIsPublic(createDTO.isPublic());
        progress.setEstimatedTime(createDTO.getEstimatedTime());
        LearningProgressUpdate savedProgress = progressRepository.save(progress);
        return convertToDTO(savedProgress);
    }

    public LearningProgressUpdateDTO updateProgressUpdate(String id, UpdateLearningProgressUpdateDTO updateDTO) {
        LearningProgressUpdate progress = progressRepository.findByIdAndDeleteStatusFalse(id);

        progress.setContent(updateDTO.getContent());
        progress.setTemplateType(updateDTO.getTemplateType());
        progress.setCompletedProgress(updateDTO.getCompletedProgress());
        progress.setUpdatedAt(new Date());
        progress.setIsPublic(updateDTO.isPublic());
        progress.setEstimatedTime(updateDTO.getEstimatedTime());
        LearningProgressUpdate updatedProgress = progressRepository.save(progress);
        return convertToDTO(updatedProgress);
    }

    public void deleteProgressUpdate(String id) {
        LearningProgressUpdate progress = progressRepository.findByIdAndDeleteStatusFalse(id);

        progress.setDeleteStatus(true);
        progressRepository.save(progress);
    }

    private LearningProgressUpdateDTO convertToDTO(LearningProgressUpdate progress) {
        LearningProgressUpdateDTO dto = new LearningProgressUpdateDTO();
        dto.setId(progress.getId());
        dto.setContent(progress.getContent());
        dto.setTemplateType(progress.getTemplateType());
        dto.setCompletedProgress(progress.getCompletedProgress());
        dto.setCreatedAt(progress.getCreatedAt());
        dto.setUpdatedAt(progress.getUpdatedAt());
        dto.setUserId(progress.getUser().getId());
        dto.setPublic(progress.isPublic());
        dto.setEstimatedTime(progress.getEstimatedTime());
        return dto;
    }

    public Optional<LearningProgressUpdate> updatePublicStatus(String id, boolean isPublic) {
        return progressRepository.findById(id).map(update -> {
            update.setIsPublic(isPublic);
            update.setUpdatedAt(new Date());
            return progressRepository.save(update);
        });
    }
}
