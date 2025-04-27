package com.example.paf_backend_2025.repositories;

import com.example.paf_backend_2025.models.LearningProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningProgressUpdateRepository extends MongoRepository<LearningProgressUpdate, String> {
    List<LearningProgressUpdate> findByUserIdAndDeleteStatusFalse(String userId);
    List<LearningProgressUpdate> findByDeleteStatusFalse();
    LearningProgressUpdate findByIdAndDeleteStatusFalse(String id);
}
