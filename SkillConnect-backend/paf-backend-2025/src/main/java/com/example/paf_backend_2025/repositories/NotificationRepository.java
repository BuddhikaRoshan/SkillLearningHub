package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.AppUser;
import com.example.paf_backend_2025.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByNotifiedTo(AppUser user);
    long countByNotifiedTo(AppUser user);
}