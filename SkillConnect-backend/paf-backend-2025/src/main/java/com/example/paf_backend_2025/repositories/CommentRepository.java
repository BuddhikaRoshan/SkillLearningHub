package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdAndDeleteStatusFalse(String postId);
    List<Comment> findByUserIdAndDeleteStatusFalse(String userId);
    Optional<Comment> findByIdAndDeleteStatusFalse(String id);
}