package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByDeleteStatusFalse();
    List<Post> findByUserIdAndDeleteStatusFalse(String userId);
    Optional<Post> findByIdAndDeleteStatusFalse(String id);
}