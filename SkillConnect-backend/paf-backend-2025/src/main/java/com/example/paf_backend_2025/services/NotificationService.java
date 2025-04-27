package com.example.paf_backend_2025.services;

import com.example.paf_backend_2025.dtos.NotificationDTO;
import com.example.paf_backend_2025.models.AppUser;
import com.example.paf_backend_2025.models.Notification;
import com.example.paf_backend_2025.repositories.AppUserRepository;
import com.example.paf_backend_2025.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    public List<NotificationDTO> getNotificationsByUserId(String userId) {
        try {
            Optional<AppUser> userOpt = appUserRepository.findById(userId);
            if (userOpt.isEmpty()) return List.of();

            return notificationRepository.findAll().stream()
                    .filter(notification -> notification.getNotifiedTo().getId().equals(userId))
                    .map(notification -> new NotificationDTO(
                            notification.getId(),
                            notification.getTitle(),
                            notification.getMessage(),
                            notification.getCreatedAt()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error while fetching notifications for userId: " + userId);
            e.printStackTrace(); // This gives full stack trace
            return List.of();
        }
    }



    public long getNotificationCountByUserId(String userId) {
        Optional<AppUser> userOpt = appUserRepository.findById(userId);
        return userOpt.map(notificationRepository::countByNotifiedTo).orElse(0L);
    }

    public Notification createNotification(String userId, String title, String message) {
        Optional<AppUser> userOpt = appUserRepository.findById(userId);
        if (userOpt.isEmpty()) return null;

        Notification notif = new Notification();
        notif.setNotifiedTo(userOpt.get());
        notif.setTitle(title);
        notif.setMessage(message);
        return notificationRepository.save(notif);
    }

    public boolean deleteNotification(String notificationId){
        try{
            notificationRepository.deleteById(notificationId);
            return true;
        }catch (Exception err){
            return false;
        }
    }
}