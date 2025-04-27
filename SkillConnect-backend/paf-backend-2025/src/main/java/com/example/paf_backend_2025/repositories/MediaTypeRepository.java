package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.MediaType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MediaTypeRepository extends MongoRepository<MediaType, String> {
    @Query("{'post.$id': ObjectId('?0')}")
    List<MediaType> findByPostId(String postId);
    Optional<MediaType> findById(String id);
}