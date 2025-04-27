package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);
    Optional<Like> findByUserIdAndPostId(String userId, String postId);
}