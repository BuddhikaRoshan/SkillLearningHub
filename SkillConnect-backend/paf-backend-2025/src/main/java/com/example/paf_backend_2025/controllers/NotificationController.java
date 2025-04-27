package com.example.pafbackend.controllers;

import com.example.pafbackend.dtos.NotificationDTO;
import com.example.pafbackend.models.Notification;
import com.example.pafbackend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable String userId) {
        try {
            return notificationService.getNotificationsByUserId(userId);
        } catch (Exception e) {
            System.out.println("Error fetching notifications for userId: " + userId);
            e.printStackTrace(); // Logs the full stack trace
            return List.of(); // Return empty list on error
        }
    }


    @GetMapping("/count/{userId}")
    public long getNotificationCount(@PathVariable String userId) {
        return notificationService.getNotificationCountByUserId(userId);
    }

    @PostMapping("/")
    public Notification createNotification(
            @RequestParam String userId,
            @RequestParam String title,
            @RequestParam String message
    ) {
        return notificationService.createNotification(userId, title, message);
    }

    @DeleteMapping("/{notificationId}")
    public boolean deleteNotification(@PathVariable String notificationId) {
        try {
            return notificationService.deleteNotification(notificationId);
        } catch (Exception e) {
            return false;        }
    }
}