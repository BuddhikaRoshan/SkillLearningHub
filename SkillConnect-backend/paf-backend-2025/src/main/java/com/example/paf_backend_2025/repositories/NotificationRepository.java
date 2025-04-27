package com.example.pafbackend.repositories;

import com.example.pafbackend.models.AppUser;
import com.example.pafbackend.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByNotifiedTo(AppUser user);
    long countByNotifiedTo(AppUser user);
}